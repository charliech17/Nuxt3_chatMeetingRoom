// ====================  init !!start!! ================== //
const allPicList = ["1","2","3","4","5"]
const baseAssetsPath = "/testImage/"

export function init(nowPickList: Ref) {
    lifeCycle_Settings()
    setPicList(nowPickList)
    disablePullReload()
}

function setPicList(nowPickList: Ref) {
    const lastItem = allPicList[allPicList.length - 1]
    const firstItem = allPicList[0]
    const secondItem = allPicList[1]
    const imageOrder = [lastItem,firstItem,secondItem]
    
    nextTick(()=> {
        imageOrder.forEach((item) => {
            nowPickList.value.push({
                name: item,
                url:  new URL(baseAssetsPath + item + ".jpg", import.meta.url).href,
            })
        })
    })
}

function disablePullReload() {
    document.body.style.overflow = 'hidden'
    document.getElementsByTagName("html")[0].style.overflow = 'hidden' 
}

function lifeCycle_Settings() {
    useHead({
        meta: [
            {
                name: 'viewport',
                content: "width=device-width, user-scalable=no"
            }
        ]
    })
}

// ====================  init !!end!! ================== //

export function getImageContainer():HTMLDivElement {
    return document.querySelector(".img_container")!
}

let nowTransition = 200
let orignTransition = 100
export function transformStart() {
    const imgContainer = getImageContainer()
    imgContainer!.style.transition = `transform 1.5s`
    imgContainer.style.transform = `translateX(-${nowTransition}vw)`
}

export function handleLoop(nowPickList: Ref) {
    const imgContainer = getImageContainer()
    imgContainer!.style.transition = ``
    
    nowPickList.value.shift()
    const newData = Number(nowPickList.value[1].name) + 1
    const finalData = newData > 5 ? 1 : newData
    
    nowPickList.value.push({
        name: finalData.toString(),
        url:  new URL(baseAssetsPath + finalData.toString() + ".jpg", import.meta.url).href,
    })

    nextTick(()=> {
        imgContainer!.style.transform = `translateX(-${orignTransition}vw)`
    })

    setTimeout(()=>{
        transformStart()
    },1000)
}


// <====================== touch event !!start!! ===========================> //
let isScale = false
const nowImgInfo = {scale: 0, distance: 0, x: 0, y: 0}
export function scaleImage(event: TouchEvent) {
    if (event.touches.length === 1) {
        tyStart = event.touches[0].clientY
    }
    else if (event.touches.length === 2) {
        nowImgInfo.x = (event.touches[0].pageX + event.touches[1].pageX) / 2; // x中點
        nowImgInfo.y = (event.touches[0].pageY + event.touches[1].pageY) / 2; // y中點
        nowImgInfo.distance = distance(event);
        isScale = true
    }

    const tagetEl = event.target!
    tagetEl.addEventListener("touchmove",handleMove)
    tagetEl.addEventListener("touchend",handleEnd)
}


let tyStart:number,tyEnd:number = 0
let lastPoint = 0
function handleMove(evt: Event) {
    if (
        evt instanceof TouchEvent 
        && evt.touches.length === 1
    ) {
        const img = evt.target as HTMLImageElement 
        tyEnd = evt.touches[0].clientY
        const moveY = lastPoint + (tyEnd-tyStart)* 0.8
        if(Math.abs(moveY) < 1) return
        
        const translateY = `translateY(${moveY}px)`
        img.style.transform = img.style.transform 
                                ?   img.style.transform.includes("translateY") 
                                    ? img.style.transform.replace(/translateY\(-?\d+(\.\d+)?px\)/, translateY)
                                    : img.style.transform += ` ${translateY}`
                                : translateY
        lastPoint = moveY
        tyStart = tyEnd
    }

    if (
        evt instanceof TouchEvent 
        && evt.touches.length === 2
    ) {
        evt.preventDefault();

        const newDistance = distance(evt);
        const scaleFactor = (newDistance / (nowImgInfo.distance))
        const scaleDirection = scaleFactor > 1 ? 1 : -1
        const scale = nowImgInfo.scale + scaleFactor * scaleDirection * 0.1
        nowImgInfo.scale = Math.min(Math.max(1,scale),5)

        const deltaX = (((evt.touches[0].pageX + evt.touches[1].pageX) / 2) - nowImgInfo.x) * 1.5; // x1.5 for accelarated movement
        const deltaY = (((evt.touches[0].pageY + evt.touches[1].pageY) / 2) - nowImgInfo.y) * 1.5; // x1.5 for accelarated movement
        const transform = `scale(${nowImgInfo.scale})`;

        const img = evt.target as HTMLImageElement
        img.style.transform = img.style.transform 
                                ? img.style.transform.includes("scale") 
                                    ? img.style.transform.replace(/scale\(\d+(\.\d+)?\)/, transform) 
                                    : img.style.transform += ` ${transform}`
                                : transform
                                console.log(img.style.transform.replace(/scale\(\d+(\.\d+)?\)/, transform))
        const imgContainer = document.querySelector(".container_scale") as HTMLDivElement
        imgContainer.style.transform = `transform(${deltaX},${deltaY})`
    }
}

function handleEnd(evt: Event) {
    if(isScale || (evt instanceof TouchEvent && evt.touches.length === 2)) {
        isScale = false
        document.removeEventListener("touchmove",handleMove)
    } 
}

export function distance(event: TouchEvent) {
    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
};

// <====================== touch event !!end!! ===========================> //
