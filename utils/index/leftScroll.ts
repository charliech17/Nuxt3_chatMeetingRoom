import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
import { calHeaderHeight } from "@/utils/baseUtils"

let scrollSection: null| HTMLElement;
let teact_part: null| HTMLElement;
let teact_part_wrapper: null| HTMLElement;
let teach_img: null| HTMLElement;
let isInTeach = false
let headerHeightMargin = 0;
let scrollYPos = 0;

function removeScrollEvtFuc() {
    scrollYPos = scrollSection!.scrollTop
    scrollSection!.removeEventListener("scroll",handleScroll)
    scrollSection!.addEventListener("scroll",handleInTeachScroll)
}

function handleScroll() {
    judgeScrollInside(removeScrollEvtFuc)
}

function handleInTeachScroll(evt: Event) {
    const nowScrollY = scrollSection!.scrollTop
    if(nowScrollY > scrollYPos) {
        console.log("往下滑")
    } else {
        console.log("往上滑")
    }
    scrollYPos = nowScrollY
}

function judgeScrollInside(removeEvtFuc: Function) {
    if( teact_part_wrapper!.getBoundingClientRect().top <= calHeaderHeight() 
        && teach_img!.getBoundingClientRect().bottom >= (
            calHeaderHeight() 
            + teach_img!.clientHeight
        )
    ) {
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
        const newSL = teact_part!.scrollLeft + scollSpeed
        smoothScroll(newSL,"teact_part",2,"x",isEnd)
        if(teact_part!.scrollLeft >= (teact_part!.scrollWidth - teact_part!.clientWidth - 3) ) {
            const newScroll = scrollSection!.scrollTop + teact_part_wrapper!.getBoundingClientRect().bottom
            smoothScroll(newScroll,"mainContent_scrollSection_ID",3)
            isInTeach = false
            handleFunc(isMoveForward)
        }
    } else {
        const newSL = teact_part!.scrollLeft - scollSpeed
        smoothScroll(newSL,"teact_part",2,"x",isEnd)
        if(teact_part!.scrollLeft <= 2) {
            teact_part!.scrollLeft = 0
            const newScroll = (scrollSection!.scrollTop - teact_part_wrapper!.scrollTop)
            smoothScroll(newScroll,"mainContent_scrollSection_ID",1)
            isInTeach = false
            handleFunc(isMoveForward)
        }
    }
}

let txs=0,txe=0,tys=0,tye=0,
    tiys = 0,tixs = 0;

function detectMobileScroll() {
    function removeEvtFuc() {
        window.addEventListener("touchstart",handleTouchStart)
        window.addEventListener("touchmove",handleTouchMove)
        window.addEventListener("touchend",handleTouchEnd)
    }
    setTimeout(()=> {
        window.requestAnimationFrame(function step() {
            const isScrollInside = judgeScrollInside(removeEvtFuc)
            if(isScrollInside) return
    
            window.requestAnimationFrame(step)
        })
    },100)
}

function handleTouchStart(evt: TouchEvent) {
    isEnd.endScroll = true
    txs = evt.touches[0].clientX
    tys = evt.touches[0].clientY
    tiys = evt.touches[0].clientY
}

function removeTouchEvtFuc() {
    window.removeEventListener("touchmove",handleTouchMove)
    window.removeEventListener("touchstart",handleTouchStart)
    detectMobileScroll()
}

function handleTouchMove(evt: TouchEvent) {
    txe = evt.touches[0].clientX
    tye = evt.touches[0].clientY
    txs = txe, tys = tye
}

let isEnd = {endScroll: false}
function handleTouchEnd(evt: TouchEvent) {
    if(!isInTeach) {
        window.removeEventListener("touchend",handleTouchEnd)
    } else {
        isEnd.endScroll = true
        let diff = (tye - tiys)
        let sign = diff < 0 ? -1 : 1
        const newSL = teact_part!.scrollLeft - diff
        
        while(Math.abs(diff) > 1.001) {
            smoothScroll(newSL,"teact_part",0.7,"x",isEnd)
            diff = Math.pow(Math.abs(diff),0.8) * sign
        }
        
        if(teact_part!.scrollLeft >= (teact_part!.scrollWidth - teact_part!.clientWidth - 3) && sign < 0) {
            isInTeach = false
            removeTouchEvtFuc()
        } else if(teact_part!.scrollLeft <= 10 && sign > 0) {
            teact_part!.scrollLeft = 0
            isInTeach = false
            removeTouchEvtFuc()
        } else{
            const scrollRatio = Math.abs(newSL / (teact_part!.scrollWidth - teact_part!.clientWidth + ( window.innerHeight + calHeaderHeight())/2))
            scrollSection!.scrollTop = 
                (   scrollSection!.scrollTop 
                    + (teact_part_wrapper!.getBoundingClientRect().top - calHeaderHeight())
                    + teact_part_wrapper!.clientHeight * scrollRatio
                )
        }
    }
}

export function initTeachPart() {
    scrollSection = document.getElementById('mainContent_scrollSection_ID')
    teact_part = document.getElementById("teact_part")!
    teact_part_wrapper = document.getElementById("teact_part_wrapper")!
    teach_img = document.getElementById("teach_img")!
    headerHeightMargin = calHeaderHeight() + 16
    
    const {isMobile} = use_deviceInfo_Store()

    if(isMobile) {
        detectMobileScroll()
    } else {
        scrollSection!.addEventListener("scroll",handleScroll)
        window.addEventListener("wheel",handleWheel)
    }
}