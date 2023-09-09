<template>
    <div class="outer-wrapper">
        <div class="inner-wrapper">
            <section class="d-flex btn-section" id="btn-section">
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
        <section id="bottom_empty_section" style="height: 32px;" @click="addNewParagraph"></section>
    </div>
</template>

<script setup lang="ts">
import {editArticleIcons} from "@/utils/icons/editArticle"

interface controlParm {
    allElHeightRange: number[],
    allElLength: number,
    nowElementIndex: null | number,
    afterElMoveIndex: null | number,
}

const paragraphRef = ref<HTMLDivElement | null>(null)
const {isEdit,isholdingEL} = {
    isEdit: ref(false),
    isholdingEL: ref(false)
}
const {img_highlight_class,img_top_highlight_class,text_edit_paragraph_class} = {
    img_highlight_class: "img_move_hightlight",
    img_top_highlight_class: "img_move_top_hightlight",
    text_edit_paragraph_class: "edit_text_paragraph"
}
let {allElHeightRange,nowElementIndex, afterElMoveIndex, allElLength}: controlParm = {
    allElHeightRange: [],
    allElLength: 0,
    nowElementIndex: null, // 目前元素在段落中排在第幾個位置(pointerdown才觸發，pointerup刪除),
    afterElMoveIndex: null,
}

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
    const allParagraph = document.getElementsByClassName(text_edit_paragraph_class)
    if(!paragraphRef.value) return
    if(isEdit.value || isholdingEL.value) return
    if( allParagraph.length > 0 
        && allParagraph[allParagraph.length -1].textContent === ''
    ) {
        const lastParagraph = allParagraph[allParagraph.length -1] as HTMLDivElement
        lastParagraph.focus()
        return
    }

    createParagraphChild("edit_text")
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
        if(parentEl?.classList.contains(text_edit_paragraph_class)) {
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

document.onpaste = function (event) {
    const items = (event.clipboardData!).items;
    for (const index in items) {
        const item = items[index];
        if (item.kind === 'file' && item.type.includes("image/")) {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                if(event.target) {
                    document.activeElement?.querySelector('img')?.remove()
                    if(!(document.activeElement instanceof HTMLElement)) return
                    document.activeElement?.blur()
                    createParagraphChild("img_part",event.target.result! as string)
                }
            }; 
            reader.readAsDataURL(blob!);
        }
    }
};

function getComputedStyle(el: HTMLElement,styKey: string) {
    const computedValue = window.getComputedStyle(el,null)
            .getPropertyValue(styKey)
            .replace("px","")
    return computedValue
}

function addMoveBlockEvt(el: HTMLElement) {
    el.addEventListener("pointerdown",()=> {
        allElHeightRange = []
        isholdingEL.value = true
        const allElement = paragraphRef.value!.children
        allElLength = allElement.length
        const pageScroll = document.getElementById("mainContent_scrollSection_ID")!.scrollTop
        for(let i=0;i<allElement!.length;i++){
            const eachEl = allElement[i] as HTMLElement
            const elHeight = pageScroll + eachEl.getBoundingClientRect().top
            allElHeightRange.push(elHeight)
            if(eachEl.id && el.id === eachEl.id) {
                nowElementIndex = i
            }
        }
        window.addEventListener('pointermove',handlePointerMove)
        window.addEventListener("pointerup",handlePointerUp)
    })

    function handlePointerMove(event: PointerEvent) {
        if(isholdingEL.value) {
            const allElement = paragraphRef.value!.children
            const pageScroll = document.getElementById("mainContent_scrollSection_ID")!.scrollTop
            const mousePosition = pageScroll + event.pageY
            // 移除先前所有highlight
            if(allElement[0]?.classList.contains(img_top_highlight_class)) {
                allElement[0]?.classList.remove(img_top_highlight_class)
            }
            for(let index=0;index<allElHeightRange.length;index++) {
                if( 
                    allElement[index]?.classList.contains(img_highlight_class)
                ){
                    allElement[index].classList.remove(img_highlight_class)
                }
            }
            // 設定新的highlight
            afterElMoveIndex = null
            for(let index=0;index<allElHeightRange.length;index++) {
                // 移動到最前對落，且原本位置不在最前段落
                if( 
                    index === 0
                    && index !== nowElementIndex
                    && mousePosition < allElHeightRange[index]
                ) {
                    afterElMoveIndex = 0
                    allElement[index]?.classList.add(img_top_highlight_class)
                    return
                }
                // 移動到兩個段落之間，且不等於原本位置
                if( 
                    allElHeightRange[index+1] 
                    && mousePosition > allElHeightRange[index]
                    && mousePosition < allElHeightRange[index+1]
                    && (index+1) !== nowElementIndex
                    && index !== nowElementIndex
                ) {
                    console.log('now index',index)
                    allElement[index]?.classList.add(img_highlight_class)
                    afterElMoveIndex = index + 1
                    return
                }
                // 移動到最後段落，且原來位置不在最後段落
                if(
                    index === allElHeightRange.length -1 
                    && index !== nowElementIndex
                    && mousePosition > allElHeightRange[index-1]
                    && mousePosition > (allElement[index].getBoundingClientRect().bottom + pageScroll)
                ) {
                    allElement[index]?.classList.add(img_highlight_class)
                    afterElMoveIndex = index + 1
                    return
                }
            }
        }
    }

    function handlePointerUp() {
        if(afterElMoveIndex) {
            // TODO 最後index parentNode.appendChild()
            if(afterElMoveIndex === allElLength) {
                
            } 
            // TODO 其它index (parentNode.insertBefore(newNode,prevNode))
            else {

            }

            afterElMoveIndex = null
        }
        nowElementIndex = null
        setTimeout(()=>{
            isholdingEL.value = false
            console.log('trigger up')
        },200)
        window.removeEventListener("pointermove",handlePointerMove)
        window.removeEventListener("pointerup",handlePointerUp)
    }
}

type cpChildType = "edit_text" | "img_part"
function createParagraphChild(elType: cpChildType,imgSRC:string|null=null) {
    switch(elType) {
        case "edit_text":
            createEditText()
            break;
        case "img_part":
            createImgPart(imgSRC!)
            break;
    }
}

function createEditText() {
    const newParagraph = document.createElement('div')
    newParagraph.classList.add(text_edit_paragraph_class)
    newParagraph.contentEditable = "true"
    newParagraph.innerHTML = `你好<span style="background-color:blue;margin:4px">哇哇</span>阿阿<span style="background-color: rgb(241, 198, 57);">我哇</span>哇我很好耶`
    newParagraph.addEventListener("click",(event)=> event.stopPropagation())
    newParagraph.addEventListener("focus",()=> isEdit.value = true)
    newParagraph.addEventListener("blur",()=>  setTimeout(()=> isEdit.value = false,200))
    newParagraph.id = new Date().toISOString()
    addMoveBlockEvt(newParagraph)
    paragraphRef.value!.appendChild(newParagraph)
    newParagraph.focus()
}

function createImgPart(imgSRC: string) {
    const wrapperDiv = document.createElement('div')
    const innerImg = document.createElement('img')
    innerImg.src = imgSRC
    wrapperDiv.style.display = 'flex'
    wrapperDiv.style.justifyContent = 'center'
    wrapperDiv.style.width = '100%'
    innerImg.draggable = false
    wrapperDiv.id = new Date().toISOString()
    addMoveBlockEvt(wrapperDiv)

    wrapperDiv.appendChild(innerImg)
    paragraphRef.value!.appendChild(wrapperDiv)
}


function init() {
    nextTick(()=>{
        const btnSection = document.getElementById('btn-section') as HTMLElement
        const bottomEptSection = document.getElementById('bottom_empty_section') as HTMLElement
        const btnSectionHeight = getComputedStyle(btnSection,'height')
        const bottomEptHeight = getComputedStyle(bottomEptSection,'height')
        console.log(bottomEptHeight)
        paragraphRef.value!.style.setProperty('--btn_section_height',`${btnSectionHeight}px`)
        paragraphRef.value!.style.setProperty('--bottom_ept_section',`${bottomEptHeight}px`)
    })
}

init()

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

    .img_move_hightlight {
        border-bottom: 5px solid #1effd5;
    }
    
    .img_move_top_hightlight {
        border-top: 5px solid #1effd5;
    }

    h2{
        font-size: 36px;
    }
</style>

<style lang="scss" scoped>
    .outer-wrapper{
        .inner-wrapper{
            .text-section{
                min-height: calc( var(--vh,1vh)*100 - var(--headerHeight) - var(--btn_section_height) - 32px - var(--bottom_ept_section));
            }
        }
    }
</style>