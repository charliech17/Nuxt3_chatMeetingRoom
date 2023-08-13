<template>
    <div class="outer-wrapper">
        <section class="d-flex btn-section">
            <div>
                <div>背景色</div>
                <v-btn
                    @click="highLight"
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

function highLight() {
    // 沒有選取內容
    if(window.getSelection()?.toString() === "") return 
    
    // 已有highLight文字 => 取消highlight
    const isDoRemove = judgeRemoveHighlight()
    if(isDoRemove) return
    
    // 未有highLight文字 => 將文字highlight
    doHighlight()
}

function addNewParagraph() {
    const allParagraph = document.getElementsByClassName("edit_text_paragraph")
    if(!paragraphRef.value) return
    if( allParagraph.length > 0 
        && allParagraph[allParagraph.length -1].textContent === '') {
            // @ts-ignore
            allParagraph[allParagraph.length -1].focus()
            return
        }

    const newParagraph = document.createElement('div')
    newParagraph.classList.add("edit_text_paragraph")
    newParagraph.contentEditable = "true"
    newParagraph.innerHTML = `你好<span class="edit_text_highlight">哇哇</span>阿阿<span class="edit_text_highlight">我哇</span>哇我很好耶`
    newParagraph.addEventListener("click",(event)=> event.stopPropagation())
    paragraphRef.value.appendChild(newParagraph)
}

function judgeRemoveHighlight() {
    const selection = document.getSelection() as Selection
    const {focusNode,anchorNode,focusOffset,anchorOffset} = selection
    if(focusNode === anchorNode) {
        const backWard = anchorOffset > focusOffset
        const juggeNode = backWard ? anchorNode : focusNode
        const parentElement = juggeNode?.parentElement
        const grandpa = parentElement?.parentElement

        if(parentElement?.classList.contains("edit_text_highlight")) {
            const startPos = backWard ? focusOffset : anchorOffset 
            const endPos = backWard ?  anchorOffset : focusOffset
            // @ts-ignore
            const textLength = juggeNode.length
            let newHTML = ''
        
            if(startPos !== 0) {
                const highlight1 = juggeNode?.textContent?.slice(0,startPos)
                newHTML += `<span class="edit_text_highlight">${highlight1}</span>`
            }    

            const unHighlight = juggeNode?.textContent?.slice(startPos,endPos)
            newHTML += unHighlight

            if(endPos !== textLength) {
                const highlight2 = juggeNode?.textContent?.slice(endPos,textLength)
                newHTML += `<span class="edit_text_highlight">${highlight2}</span>`
            }

            parentElement.outerHTML = newHTML
            grandpa?.normalize()

            return true
        }
        return false
    }
}

function doHighlight() {
    doStartEndNoHighlight()
    doStartOrEndHighlight()
}

function doStartEndNoHighlight() {
    const {anchorNode, focusNode} = document.getSelection() as Selection

    if( 
        !anchorNode?.parentElement?.classList.contains("edit_text_highlight") 
        && !focusNode?.parentElement?.classList.contains("edit_text_highlight")
    ) {
        const surrElement = document.createElement("span")
        const range = window.getSelection()?.getRangeAt(0)
        surrElement.classList.add("edit_text_highlight")
        range?.surroundContents(surrElement)

        surrElement.childNodes.forEach((node) => {
            // @ts-ignore
            if(node.classList && node.classList.contains("edit_text_highlight")) {
                const nodeText = node.textContent as string
                node.replaceWith(nodeText)
            }
        })
        surrElement.normalize()

        removeConcatElement(surrElement)
    }
}

function doStartOrEndHighlight() {
    const {anchorNode, anchorOffset, focusNode, focusOffset} = document.getSelection() as Selection
    const backWard = isBackWard()
    const anchorParentElement = anchorNode?.parentElement
    const focusParentElement = focusNode?.parentElement
    const isAnchorContains = anchorParentElement?.classList.contains("edit_text_highlight")
    const isFocusContains = focusParentElement?.classList.contains("edit_text_highlight")
    if(isAnchorContains || isFocusContains) {
        const finalAnchorOffset = backWard 
                                ? isAnchorContains ? anchorNode?.textContent?.length : anchorOffset
                                : isAnchorContains ? 0 : anchorOffset
        const finalFoucsOffset = backWard 
                                ? isFocusContains ? 0 : focusOffset
                                : isFocusContains ? focusNode?.textContent?.length : focusOffset
        // @ts-ignore
        document.getSelection()?.setBaseAndExtent(anchorNode,finalAnchorOffset , focusNode, finalFoucsOffset)
        
        const surrElement = document.createElement("span")
        const range = window.getSelection()?.getRangeAt(0) as Range
        surrElement.classList.add("edit_text_highlight")

        surrElement.appendChild(range.extractContents())
        range.insertNode(surrElement)

        surrElement.childNodes.forEach((node)=> {
            if(node.nodeName === "#text") return
            // @ts-ignore
            if(node.classList.contains("edit_text_highlight")) {
                node.replaceWith(node.textContent as string)
            }
        })

        surrElement.normalize()
        removeConcatElement(surrElement)
    }
}

function removeConcatElement(surrElement: any) {
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
        // @ts-ignore
        const nodeHTML = node.outerHTML ? node.outerHTML : nodeText
        if(!nodeText) return
        // @ts-ignore
        if(node.classList && node.classList.contains("edit_text_highlight")) {
            console.log("!!!",node)
            tempHTML += nodeText
        } else if(tempHTML) {
            // @ts-ignore
            finalHTML += `<span class="edit_text_highlight">${tempHTML}</span>` + `${nodeHTML}`
            tempHTML = ''
        } else {
            // @ts-ignore
            finalHTML += `${nodeHTML}`
        }
    })

    if(!parentEl) return
    parentEl.innerHTML = finalHTML + (tempHTML ? `<span class="edit_text_highlight">${tempHTML}</span>` : '')
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