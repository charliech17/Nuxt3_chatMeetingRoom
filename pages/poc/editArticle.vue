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
import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'

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
const {
    img_highlight_class,img_top_highlight_class,text_edit_paragraph_class,
    not_selectable_calss,edit_text,img_part
} = {
    img_highlight_class: "img_move_hightlight",
    img_top_highlight_class: "img_move_top_hightlight",
    text_edit_paragraph_class: "edit_text_paragraph",
    not_selectable_calss: "not_selectable",
    img_part: "img_part",
    edit_text: "edit_text"
}
let {allElHeightRange,nowElementIndex, afterElMoveIndex, allElLength}: controlParm = {
    allElHeightRange: [],
    allElLength: 0,
    nowElementIndex: null, // 目前元素在段落中排在第幾個位置(pointerdown才觸發，pointerup刪除),
    afterElMoveIndex: null,
}
let headerHeight: null | number =  null
let btnSectionHeight: null | number = null
let bottomEptHeight: null | number = null 
const edit_section_mTop = 20

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

    const initInnerHTML = `你好<span style="background-color:blue;margin:4px">哇哇</span>阿阿<span style="background-color: rgb(241, 198, 57);">我哇</span>哇我很好耶`
    createParagraphChild("edit_text",initInnerHTML,true)
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
                    createParagraphChild(img_part as cpChildType,null,true,event.target.result! as string)
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

let timer: ReturnType<typeof setTimeout>;
function addMoveBlockEvt(el: HTMLElement) {
    el.addEventListener("pointerdown",(event: PointerEvent)=> {
        // 若使用者正在編輯，不進行移動區塊處理
        if(isEdit.value) return
        // 清除timeout，若使用者點擊元素超過1秒，觸發移動區塊處理
        event.stopPropagation()
        clearTimeout(timer)
        timer = setTimeout(()=> { 
            allElHeightRange = []
            isholdingEL.value = true
            const allElement = paragraphRef.value!.children
            allElLength = allElement.length
            const pageScroll = document.getElementById("mainContent_scrollSection_ID")!.scrollTop
            disableScroll(true)
            for(let i=0;i<allElement!.length;i++){
                const eachEl = allElement[i] as HTMLElement
                const elHeight = pageScroll + eachEl.getBoundingClientRect().top
                allElHeightRange.push(elHeight)
                if(eachEl.id && el.id === eachEl.id) {
                    nowElementIndex = i
                }
            }

            const isMobile = isMobileDevice()
            if(isMobile) {
                window.addEventListener("touchmove",handlePointerMove)
                window.addEventListener("touchend",handlePointerUp)
            } else {
                window.addEventListener('mousemove',handlePointerMove)
                window.addEventListener("mouseup",handlePointerUp)
            }
        },1000)
    })

    function handlePointerMove(event: MouseEvent | TouchEvent) {
        if(isholdingEL.value) {
            event.stopPropagation()
            const allElement = paragraphRef.value!.children
            const pageScroll = document.getElementById("mainContent_scrollSection_ID")!.scrollTop
            const mousePosition = (event instanceof MouseEvent ? event.pageY : event.touches[0].pageY)
            const mouseAbsPosition = pageScroll + mousePosition
            // 移除先前所有highlight
            removeAllHighlight(allElement)
            // 設定新的highlight
            afterElMoveIndex = null
            for(let index=0;index<allElHeightRange.length;index++) {
                /* 滑鼠移動到最上方，頁面需往上滑動，以及滑鼠移到最下方，網頁需往下滑判斷: 
                    往上滑動判斷: 
                        1. 移動到畫面距離header小於8px距離 2. 整個頁面往下滑動超過按鈕部份及16px padding 
                    往下滑動判斷:
                        1. 移動到畫面距離頁面最下方小於8px距離 2. 滑鼠絕對位置，比從最上方元素加到最下方元素高度小。
                */
                if( mousePosition <= (8 + headerHeight!)
                    && pageScroll > (btnSectionHeight! + 16)
                ) {
                    document.getElementById("mainContent_scrollSection_ID")!.scrollTop -= 0.5
                } else if(
                    mousePosition > (use_deviceInfo_Store().deviceViewHeight! - 8)
                    && mouseAbsPosition < (
                        headerHeight! + btnSectionHeight! + 16 + Number(getComputedStyle(paragraphRef.value!,'height')) + bottomEptHeight! + edit_section_mTop)
                ) {
                    const st = document.getElementById("mainContent_scrollSection_ID")!.scrollTop
                    document.getElementById("mainContent_scrollSection_ID")!.scrollTop = st + 1 // scrollTop測試無法加小數
                }
                // 移動到最前對落，且原本位置不在最前段落
                if( 
                    index === 0
                    && index !== nowElementIndex
                    && mouseAbsPosition < allElHeightRange[index]
                ) {
                    afterElMoveIndex = 0
                    allElement[index]?.classList.add(img_top_highlight_class)
                    return
                }
                // 移動到兩個段落之間，且不等於原本位置
                if( 
                    allElHeightRange[index+1] 
                    && mouseAbsPosition > allElHeightRange[index]
                    && mouseAbsPosition < allElHeightRange[index+1]
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
                    && mouseAbsPosition > allElHeightRange[index-1]
                    && mouseAbsPosition > (allElement[index].getBoundingClientRect().bottom + pageScroll)
                ) {
                    allElement[index]?.classList.add(img_highlight_class)
                    afterElMoveIndex = index + 1
                    return
                }
            }
        }
    }

    function handlePointerUp() {
        console.log('tiggerup')
        if(!isholdingEL.value) {
            clearTimeout(timer)
        }
        // 移動元素
        const allElement = paragraphRef.value!.children
        if(afterElMoveIndex || afterElMoveIndex === 0) {
            const bmEl = allElement[nowElementIndex as number] as HTMLElement
            const elType = bmEl.dataset.tagPurpose as cpChildType
            const bmElInnerHtml = bmEl.innerHTML
            const cloneEl = createParagraphChild(elType,bmElInnerHtml,false)
            if(afterElMoveIndex === allElLength) {
                paragraphRef.value?.appendChild(cloneEl)
                bmEl.remove()
            } else {
                const prevEl = allElement[afterElMoveIndex]
                paragraphRef.value?.insertBefore(cloneEl,prevEl)
                bmEl.remove()
            }
            afterElMoveIndex = null
        }
        nowElementIndex = null
        // 讓畫面可以滑動
        disableScroll(false)
        // 清除所有highlight
        removeAllHighlight(allElement)
        // 清除holdingEl
        setTimeout(()=>{
            isholdingEL.value = false
        },200)
        // 清除移動事件
        window.removeEventListener("mousemove",handlePointerMove)
        window.removeEventListener("mouseup",handlePointerUp)
        window.removeEventListener("touchmove",handlePointerMove)
        window.removeEventListener("touchend",handlePointerUp)
    }
}

type cpChildType = "edit_text" | "img_part"
function createParagraphChild(
    elType: cpChildType, innerHTML: string|null, isInit=false, imgSRC:string|null=null
) {
    switch(elType) {
        case "edit_text":
            return createEditText(elType,innerHTML as string,isInit)
        case "img_part":
            return createImgPart(innerHTML,imgSRC!)
    }
}

function createEditText(elType: cpChildType,innerHTML: string,isInit: boolean) {
    const newParagraph = document.createElement('div')
    newParagraph.classList.add(text_edit_paragraph_class)
    newParagraph.classList.add(not_selectable_calss)
    newParagraph.contentEditable = "false"
    newParagraph.innerHTML = innerHTML
    newParagraph.dataset.tagPurpose = edit_text
    newParagraph.id = new Date().toISOString()

    addElEvtListener(elType,newParagraph)

    if(isInit) {
        newParagraph.contentEditable = "true"
        newParagraph.classList.remove(not_selectable_calss)
        paragraphRef.value!.appendChild(newParagraph)
        newParagraph.focus()
    }

    return newParagraph
}

function addElEvtListener(elType: cpChildType,el: HTMLElement){
    switch(elType) {
        case "edit_text":
            el.addEventListener("click",(event)=> {
                if(isholdingEL.value) return
                el.contentEditable = "true"
                el.classList.remove(not_selectable_calss)
                el.focus()
                clearTimeout(timer)
                event.stopPropagation()
            })
            el.addEventListener("focus",()=> isEdit.value = true)
            el.addEventListener("blur",()=>  {
                setTimeout(()=> {
                    el.contentEditable = "false"
                    el.classList.add(not_selectable_calss)
                    isEdit.value = false
                },200)
            })
            addMoveBlockEvt(el)
            break
        case "img_part":
            addMoveBlockEvt(el)
            break
    }
    
}

function createImgPart(innerHTML: string|null,imgSRC: string) {
    const wrapperDiv = document.createElement('div')
    wrapperDiv.style.display = 'flex'
    wrapperDiv.style.justifyContent = 'center'
    wrapperDiv.style.width = '100%'
    wrapperDiv.draggable = false
    wrapperDiv.id = new Date().toISOString()
    wrapperDiv.dataset.tagPurpose = img_part
    

    if(!innerHTML) {
        const innerImg = document.createElement('img')
        innerImg.src = imgSRC
        innerImg.draggable = false
        wrapperDiv.appendChild(innerImg)
        paragraphRef.value!.appendChild(wrapperDiv)
    } else{
        wrapperDiv.innerHTML = innerHTML
    }

    addElEvtListener(img_part as cpChildType, wrapperDiv)
    return wrapperDiv
}

function removeAllHighlight(allElement: HTMLCollection) {
    if(allElement[0]?.classList.contains(img_top_highlight_class)) {
        allElement[0]?.classList.remove(img_top_highlight_class)
    }

    for(let index=0;index<allElHeightRange.length;index++) {
        const elClassList = allElement[index]?.classList
        const isHighLight = elClassList?.contains(img_highlight_class)
                            || elClassList?.contains(img_top_highlight_class)
        if(isHighLight){
            elClassList.remove(img_highlight_class)
            elClassList.remove(img_top_highlight_class)
        }
    }
}

function calELHeight(id:string,propertyName: string) {
    const el = document.getElementById(id) as HTMLElement //'btn-section'
    const elHeight = getComputedStyle(el, propertyName) //height
    return elHeight
}

function init() {
    nextTick(()=>{
        headerHeight =  calHeaderHeight()
        btnSectionHeight = Number(calELHeight("btn-section","height"))
        bottomEptHeight = Number(calELHeight("bottom_empty_section","height"))
        paragraphRef.value!.style.setProperty('--btn_section_height',`${btnSectionHeight}px`)
        paragraphRef.value!.style.setProperty('--bottom_ept_section',`${bottomEptHeight}px`)
        paragraphRef.value!.style.setProperty('--first_item_marginTop',`${edit_section_mTop}px`)
        document.body.style.overflow = "hidden"
        document.getElementsByTagName("html")[0].style.overflow = "hidden"
    })
}

init()

</script>


<style lang="scss">
    .edit_text_paragraph{
        line-height: 1.8rem;
        font-size: 1.2rem;
    }
    .text-section {
        margin-top: var(--first_item_marginTop);
    }
    .edit_text_highlight {
        background-color: rgb(241, 198, 57);
    }

    .not_selectable {
        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    .img_move_hightlight {
        border-bottom: 5px solid #1effd5;
    }
    
    .img_move_top_hightlight {
        border-top: 5px solid #1effd5;
    }
</style>

<style lang="scss" scoped>
    .outer-wrapper{
        .inner-wrapper{
            .text-section{
                min-height: calc( var(--vh,1vh)*100 - var(--headerHeight) - var(--btn_section_height) - 32px - 16px - var(--bottom_ept_section));
            }
        }
    }
</style>