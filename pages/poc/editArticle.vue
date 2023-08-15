<template>
    <div class="outer-wrapper">
        <section class="d-flex btn-section">
            <div>
                <div>背景色</div>
                <v-btn
                    @click="() => addStyle('background-color','rgb(241, 198, 57)')"
                    :icon="editArticleIcons.mdiSelectColor"
                />
            </div>
        </section>
        <section ref="paragraphRef" class="text-section" @click="addNewParagraph"></section>
    </div>
</template>

<script setup lang="ts">
import {editArticleIcons} from "@/utils/icons/editArticle"

const paragraphRef = ref<HTMLDivElement | null>(null)

function addStyle(styleName: string, styleValue: string) {
    // 沒有選取內容
    if(window.getSelection()?.toString() === "") return 
    
    // 已有highLight文字 => 取消highlight
    const isDoRemove = judgeRemoveStyle(styleName)
    if(isDoRemove) return
    
    // 未有highLight文字 => 將文字highlight
    doHighlight(styleName,styleValue)
}

function addNewParagraph() {
    const allParagraph = document.getElementsByClassName("edit_text_paragraph")
    if(!paragraphRef.value) return
    if( allParagraph.length > 0 
        && allParagraph[allParagraph.length -1].textContent === ''
    ) {
        const lastParagraph = allParagraph[allParagraph.length -1] as HTMLDivElement
        lastParagraph.focus()
        return
    }

    const newParagraph = document.createElement('div')
    newParagraph.classList.add("edit_text_paragraph")
    newParagraph.contentEditable = "true"
    newParagraph.innerHTML = `你好<span style="background-color:blue;margin:4px">哇哇</span>阿阿<span style="background-color: rgb(241, 198, 57);">我哇</span>哇我很好耶`
    newParagraph.addEventListener("click",(event)=> event.stopPropagation())
    paragraphRef.value.appendChild(newParagraph)
}

function judgeRemoveStyle(styleName: string) {
    const selection = document.getSelection() as Selection
    const {focusNode,anchorNode,focusOffset,anchorOffset} = selection
    if(focusNode === anchorNode) {
        const backWard = anchorOffset > focusOffset
        const juggeNode = backWard ? anchorNode : focusNode
        const parentElement = juggeNode?.parentElement as HTMLElement
        const grandpa = parentElement.parentElement
        const elementStyles = parentElement.style.cssText

        if(elementStyles.includes(styleName) && juggeNode instanceof Text) {
            const startPos = backWard ? focusOffset : anchorOffset 
            const endPos = backWard ?  anchorOffset : focusOffset
            const textLength = juggeNode.length

            let newHTML = ''
        
            if(startPos !== 0) {
                const highlight1 = juggeNode?.textContent?.slice(0,startPos)
                newHTML += `<span style="${elementStyles}">${highlight1}</span>`
            }    

            const otherCss = getOtherCssText(parentElement,styleName)
            const unHighlight = juggeNode?.textContent?.slice(startPos,endPos)
            newHTML += (otherCss 
                        ? `<span style="${otherCss}">${unHighlight}</span>`
                        : unHighlight
                    )
            console.log("otherCss",otherCss)

            if(endPos !== textLength) {
                const highlight2 = juggeNode?.textContent?.slice(endPos,textLength)
                newHTML += `<span style="${elementStyles}">${highlight2}</span>`
            }

            parentElement.outerHTML = newHTML
            grandpa?.normalize()

            return true
        }
        return false
    }
}

function doHighlight(styleName: string,styleValue:string) {
    doStartEndNoHighlight(styleName,styleValue)
    doStartOrEndHighlight(styleName,styleValue)
}

function doStartEndNoHighlight(styleName: string,styleValue:string) {
    const {anchorNode, focusNode}: {anchorNode: Selection['anchorNode'],focusNode: Selection['focusNode']} = document.getSelection() as Selection

    if( 
        !anchorNode?.parentElement?.style.cssText.includes(styleName)
        && !focusNode?.parentElement?.style.cssText.includes(styleName)
    ) {
        const surrElement = document.createElement("span")
        const range = window.getSelection()?.getRangeAt(0)
        surrElement.style.setProperty(styleName,styleValue)
        range?.surroundContents(surrElement)

        surrElement.childNodes.forEach((node) => {
            if(
                node instanceof HTMLElement 
                && node.style 
                && node.style.cssText.includes(styleName)
            ) {
                const otherCss = getOtherCssText(node,styleName)
                const nodeText = otherCss 
                                ? `<span style="${otherCss}">${node.textContent}</span>`
                                : node.textContent as string
                node.replaceWith(nodeText)
            }
        })
        surrElement.normalize()

        removeConcatElement(surrElement,styleName,styleValue)
    }
}

function doStartOrEndHighlight(styleName: string,styleValue:string) {
    const {anchorNode, anchorOffset, focusNode, focusOffset} = document.getSelection() as Selection
    const backWard = isBackWard()
    const anchorParentElement = anchorNode?.parentElement
    const focusParentElement = focusNode?.parentElement
    const isAnchorContains = anchorParentElement?.style.cssText.includes(styleName)
    const isFocusContains = focusParentElement?.style.cssText.includes(styleName)
    if(isAnchorContains || isFocusContains) {
        const finalAnchorOffset = backWard 
                                ? isAnchorContains ? anchorNode?.textContent?.length : anchorOffset
                                : isAnchorContains ? 0 : anchorOffset
        const finalFoucsOffset = backWard 
                                ? isFocusContains ? 0 : focusOffset
                                : isFocusContains ? focusNode?.textContent?.length : focusOffset
        document.getSelection()?.setBaseAndExtent(anchorNode!,finalAnchorOffset! , focusNode!, finalFoucsOffset!)
        
        const surrElement = document.createElement("span")
        const range = window.getSelection()?.getRangeAt(0) as Range
        surrElement.style.setProperty(styleName,styleValue)

        surrElement.appendChild(range.extractContents())
        range.insertNode(surrElement)

        surrElement.childNodes.forEach((node)=> {
            if(node.nodeName === "#text") return
            if(node instanceof HTMLElement && node.style && node.style.cssText.includes(styleName)) {
                const otherCss = getOtherCssText(node,styleName)
                node.replaceWith(otherCss 
                                ? `<span style="${otherCss}">${node.textContent}</span>`
                                : node.textContent as string)
            }
        })

        surrElement.normalize()
        removeConcatElement(surrElement,styleName,styleValue)
    }
}

function removeConcatElement(surrElement: any, styleName: string, styleValue: string) {
    let parentEl = surrElement.parentElement
    while(parentEl?.parentElement) {
        if(parentEl?.classList.contains("edit_text_paragraph")) {
            break;
        }
        parentEl = parentEl.parentElement 
    }
    let finalHTML = ''
    let tempHTML = ''
    parentEl?.childNodes.forEach((node: any)=> {
        const nodeText = node.textContent
        const nodeHTML = node.outerHTML ? node.outerHTML : nodeText
        if(!nodeText) return

        if( node.style 
            && node.style.cssText.includes(styleName) 
            && node.style.getPropertyValue(styleName) === styleValue
        ) {
            console.log("!!!",node)
            const otherCss = getOtherCssText(node,styleName)
            tempHTML += otherCss 
                        ? `<span style="${otherCss}">${nodeText}</span>`
                        : nodeText
            console.log(tempHTML)
        } else if(tempHTML) {
            finalHTML += (`<span style="${styleName}:${styleValue};">${tempHTML}</span>` 
                            + `${nodeHTML}`)
            tempHTML = ''
        } else {
            finalHTML += `${nodeHTML}`
        }
    })

    if(!parentEl) return
    parentEl.innerHTML = finalHTML + (tempHTML ? `<span style="${styleName}:${styleValue};">${tempHTML}</span>` : '')
}

function isBackWard() {
    let sel = getSelection() as Selection,
        position = sel.anchorNode?.compareDocumentPosition(sel.focusNode as Node),
        backward = false;
    if (
        !position && sel.anchorOffset > sel.focusOffset || 
        position === Node.DOCUMENT_POSITION_PRECEDING
    ) {
            backward = true; 
        }
        
    return backward
}

function getOtherCssText(node: HTMLElement,styleName:string) {
    const cssPros = node.style.removeProperty(styleName)
    return node.style.cssText
}

</script>


<style lang="scss">
    .edit_text_paragraph{
        line-height: 1.8rem;
        font-size: 1.2rem;
    }
    .text-section > .edit_text_paragraph:nth-child(1) {
        margin-top: 20px;
    }
    .edit_text_highlight {
        background-color: rgb(241, 198, 57);
    }

    h2{
        font-size: 36px;
    }
</style>

<style lang="scss" scoped>
    .outer-wrapper{
        height: 100%;
        .text-section{
            height: 100%;
        }
    }
</style>