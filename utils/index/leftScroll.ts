import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
import { calHeaderHeight } from "@/utils/baseUtils"

let scrollSection: null| HTMLElement;
let teact_part: null| HTMLElement;
let isInTeach = false
let headerHeightMargin = 0;

function removeScrollEvtFuc() {
    scrollSection!.removeEventListener("scroll",handleScroll)
}

function handleScroll() {
    judgeScrollInside(removeScrollEvtFuc)
}

function judgeScrollInside(removeEvtFuc: Function) {
    if(teact_part!.getBoundingClientRect().top <= headerHeightMargin && teact_part!.getBoundingClientRect().bottom > 0) {
        const scrollSection = document.getElementById('mainContent_scrollSection_ID')
        scrollSection!.style.overflow = "hidden"
        teact_part!.style.overflowX = "auto"
        isInTeach = true
        removeEvtFuc()
        return true
    }
    return false
}

function removeWheelEvtFuc(isMoveForward: boolean) {
    if(isMoveForward) {
        window.removeEventListener("wheel",handleWheel)
    } else {
        scrollSection!.addEventListener("scroll",handleScroll)
    }
}

function handleWheel(evt: WheelEvent) {
    const scollSpeed = 30
    if(!teact_part) return

    if(isInTeach && evt.deltaY > 0) {
        judgeMoveDirection(true,removeWheelEvtFuc,scollSpeed)
    } else if(isInTeach && evt.deltaY < 0) {
        judgeMoveDirection(false,removeWheelEvtFuc,scollSpeed)
    }
}

function judgeMoveDirection(isMoveForward: boolean,handleFunc: Function, scollSpeed: number) {
    if(isMoveForward) {
        teact_part!.scrollLeft = teact_part!.scrollLeft + scollSpeed
        if(teact_part!.scrollLeft >= (teact_part!.scrollWidth - teact_part!.clientWidth - 3) ) {
            const newScroll = scrollSection!.scrollTop + teact_part!.getBoundingClientRect().bottom
            scrollSection!.style.overflow = ""
            smoothScroll(newScroll,"mainContent_scrollSection_ID",1)
            isInTeach = false
            teact_part!.style.overflowX = "hidden"
            teact_part!.scrollLeft = 0
            handleFunc(isMoveForward)
        }
    } else {
        teact_part!.scrollLeft = teact_part!.scrollLeft - scollSpeed
        if(teact_part!.scrollLeft <= 0) {
            teact_part!.style.overflowX = "hidden"
            teact_part!.scrollLeft = 0
            const newScroll = scrollSection!.scrollTop - teact_part!.getBoundingClientRect().top
            smoothScroll(newScroll,"mainContent_scrollSection_ID",2)
            scrollSection!.style.overflow = ""
            isInTeach = false
            handleFunc(isMoveForward)
        }
    }
}

let txs=0,txe=0,tys=0,tye=0;

function detectMobileScroll() {
    function removeEvtFuc() {
        window.addEventListener("touchstart",handleTouchStart)
        window.addEventListener("touchmove",handleTouchMove)
        window.addEventListener("touchend",handleTouchEnd)
    }
    window.requestAnimationFrame(function step() {
        const isScrollInside = judgeScrollInside(removeEvtFuc)
        if(isScrollInside) return

        window.requestAnimationFrame(step)
    })
}

function handleTouchStart(evt: TouchEvent) {
    txs = evt.touches[0].clientX
    tys = evt.touches[0].clientY
}

function removeTouchEvtFuc(isMoveForward: boolean) {
    window.removeEventListener("touchmove",handleTouchMove)
    window.removeEventListener("touchstart",handleTouchStart)
    if(!isMoveForward) {
        detectMobileScroll()
    } 
}

function handleTouchMove(evt: TouchEvent) {
    txe = evt.touches[0].clientX
    tye = evt.touches[0].clientY

    const scollSpeed = Math.abs(tye - tys)

    if(tye < tys || txe < txs) { // 往下滑(手指往上)或往右滑(手指往左)
        judgeMoveDirection(true,removeTouchEvtFuc,scollSpeed)
    } else if(tye > tys || txe > txs) { // 往上滑(手指往下)或往左滑(手指往右)
        judgeMoveDirection(false,removeTouchEvtFuc,scollSpeed)
    }

    txs = txe, tys = tye
}

function handleTouchEnd() {
    if(!isInTeach) {
        window.removeEventListener("touchend",handleTouchEnd)
    }
}

export function initTeachPart() {
    scrollSection = document.getElementById('mainContent_scrollSection_ID')
    teact_part = document.getElementById("teact_part")!
    headerHeightMargin = calHeaderHeight() + 16
    
    const {isMobile} = use_deviceInfo_Store()

    if(isMobile) {
        detectMobileScroll()
    } else {
        scrollSection!.addEventListener("scroll",handleScroll)
        window.addEventListener("wheel",handleWheel)
    }
}