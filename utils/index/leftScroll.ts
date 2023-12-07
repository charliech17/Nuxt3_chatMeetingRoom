import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
import { calHeaderHeight } from "@/utils/baseUtils"

let scrollSection: null| HTMLElement;
let teact_part: null| HTMLElement;
let isInTeach = false
let headerHeightMargin = 0;

function handleScroll() {
    if(teact_part!.getBoundingClientRect().top <= headerHeightMargin && teact_part!.getBoundingClientRect().bottom > 0) {
        const scrollSection = document.getElementById('mainContent_scrollSection_ID')
        scrollSection!.style.overflow = "hidden"
        teact_part!.style.overflowX = "auto"
        isInTeach = true
        scrollSection!.removeEventListener("scroll",handleScroll)
    }
}

function handleWheel(evt: WheelEvent) {
    const scollSpeed = 30
    if(!teact_part) return

    if(isInTeach && evt.deltaY > 0) {
        teact_part!.scrollLeft = teact_part!.scrollLeft + scollSpeed
        console.log(teact_part.scrollLeft,teact_part.scrollWidth - teact_part.clientWidth)
        if(teact_part.scrollLeft >= (teact_part.scrollWidth - teact_part.clientWidth - 3) ) {
            teact_part.scrollLeft = teact_part.scrollWidth - teact_part.clientWidth
            const newScroll = scrollSection!.scrollTop + teact_part.getBoundingClientRect().bottom
            scrollSection!.style.overflow = ""
            smoothScroll(newScroll,"mainContent_scrollSection_ID",1)
            isInTeach = false
            teact_part.style.overflowX = "hidden"
            teact_part.scrollLeft = 0
            window.removeEventListener("wheel",handleWheel)
        }
    } else if(isInTeach && evt.deltaY < 0) {
        teact_part.scrollLeft = teact_part.scrollLeft - scollSpeed
        if(teact_part.scrollLeft <= 0) {
            teact_part.style.overflowX = "hidden"
            teact_part.scrollLeft = 0
            
            const newScroll = scrollSection!.scrollTop - teact_part.getBoundingClientRect().top
            smoothScroll(newScroll,"mainContent_scrollSection_ID",2)
            scrollSection!.style.overflow = ""
            isInTeach = false
            scrollSection!.addEventListener("scroll",handleScroll)
        }
    }
}

let txs=0,txe=0,tys=0,tye=0;

function handleTouchStart(evt: TouchEvent) {
    txs = evt.touches[0].clientX
    tys = evt.touches[0].clientY
    if( teact_part!.getBoundingClientRect().top <= headerHeightMargin 
        && teact_part!.getBoundingClientRect().bottom > 0
        && !isInTeach
    ) {
        const scrollSection = document.getElementById('mainContent_scrollSection_ID')
        scrollSection!.style.overflow = "hidden"
        teact_part!.style.overflowX = "auto"
        isInTeach = true
        scrollSection!.removeEventListener("touchstart",handleTouchStart)
        scrollSection!.removeEventListener("touchmove",detectInTeach)
        window.addEventListener("touchstart",inTeachStart)
        window.addEventListener("touchmove",handleTouchMove)
        window.addEventListener("touchend",handleTouchEnd)
    }
}

function inTeachStart(evt: TouchEvent) {
    txs = evt.touches[0].clientX
    tys = evt.touches[0].clientY
}

function detectInTeach() {
    if( teact_part!.getBoundingClientRect().top <= headerHeightMargin 
        && teact_part!.getBoundingClientRect().bottom > 0
        && !isInTeach
    ) {
        const scrollSection = document.getElementById('mainContent_scrollSection_ID')
        scrollSection!.style.overflow = "hidden"
        teact_part!.style.overflowX = "auto"
        isInTeach = true
        scrollSection!.removeEventListener("touchstart",handleTouchStart)
        scrollSection!.removeEventListener("touchmove",detectInTeach)
        window.addEventListener("touchstart",inTeachStart)
        window.addEventListener("touchmove",handleTouchMove)
        window.addEventListener("touchend",handleTouchEnd)
    }
}

function handleTouchMove(evt: TouchEvent) {
    txe = evt.touches[0].clientX
    tye = evt.touches[0].clientY

    const scollSpeed = Math.abs(tye - tys)

    if(tye < tys || txe < txs) { // 往下滑(手指往上)或往右滑(手指往左)
        teact_part!.scrollLeft = teact_part!.scrollLeft + scollSpeed
        console.log(teact_part!.scrollLeft,teact_part!.scrollWidth - teact_part!.clientWidth - 3)
        if(teact_part!.scrollLeft >= (teact_part!.scrollWidth - teact_part!.clientWidth - 3) ) {
            const newScroll = scrollSection!.scrollTop + teact_part!.getBoundingClientRect().bottom
            scrollSection!.style.overflow = ""
            smoothScroll(newScroll,"mainContent_scrollSection_ID",1)
            isInTeach = false
            teact_part!.style.overflowX = "hidden"
            teact_part!.scrollLeft = 0
            window.removeEventListener("touchmove",handleTouchMove)
            window.removeEventListener("touchstart",inTeachStart)
            scrollSection!.removeEventListener("touchstart",handleTouchStart)
        }
    } else if(tye > tys || txe > txs) { // 往上滑(手指往下)或往左滑(手指往右)
        teact_part!.scrollLeft = teact_part!.scrollLeft - scollSpeed
        if(teact_part!.scrollLeft <= 0) {
            teact_part!.style.overflowX = "hidden"
            teact_part!.scrollLeft = 0
            const newScroll = scrollSection!.scrollTop - teact_part!.getBoundingClientRect().top
            smoothScroll(newScroll,"mainContent_scrollSection_ID",2)
            scrollSection!.style.overflow = ""
            isInTeach = false
            window.removeEventListener("touchmove",handleTouchMove)
            window.removeEventListener("touchstart",inTeachStart)
            scrollSection!.addEventListener("touchstart",handleTouchStart)
        }
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
        scrollSection!.addEventListener("touchstart",handleTouchStart)
        scrollSection!.addEventListener("touchmove",detectInTeach)
    } else {
        scrollSection!.addEventListener("scroll",handleScroll)
        window.addEventListener("wheel",handleWheel)
    }
}