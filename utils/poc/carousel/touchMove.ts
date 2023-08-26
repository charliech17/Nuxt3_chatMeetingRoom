let isScale = false
const nowImgInfo = {scale: 1, distance: 0, x: 0, y: 0}
let tyStart:number = 0, tyEnd:number = 0, 
    txStart:number = 0 , txEnd:number = 0
let lastPointY:number = 0, lastPointX: number = 0


export function scaleImage(event: TouchEvent) {
    if (event.touches.length === 1) {
        tyStart = event.touches[0].clientY
        txStart = event.touches[0].clientX
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

function handleMove(evt: Event) {
    if (
        evt instanceof TouchEvent 
        && evt.touches.length === 1
    ) {
        const img = evt.target as HTMLImageElement 
        tyEnd = evt.touches[0].clientY
        const moveY = lastPointY + (tyEnd-tyStart)* 0.8

        txEnd = evt.touches[0].clientX
        const moveX = lastPointX + (txEnd-txStart)* 0.8
        
        if(isExcessBoundryX(img,moveX)) return
        
        // 若在邊界內，不移動外層translateX位置
        evt.stopPropagation() 

        // 將外層transform: translateX改成0
        const outerTranslateX = `translateX(${0})`
        const imgContainer = document.querySelector(".container_scale") as HTMLDivElement
        handleTransform(imgContainer,'translateX',outerTranslateX)

        // 更新translateX及translateY
        const translateY = `translateY(${moveY}px)`
        handleTransform(img,`translateY`,translateY)
        const translateX = `translateX(${moveX}px)`
        handleTransform(img,`translateX`,translateX)

        lastPointY = moveY
        tyStart = tyEnd
        lastPointX = moveX
        txStart = txEnd
    }

    if (
        evt instanceof TouchEvent 
        && evt.touches.length === 2
    ) {
        evt.preventDefault();
        evt.stopPropagation()

        const newDistance = distance(evt);
        const scaleFactor = (newDistance / (nowImgInfo.distance))
        const scaleDirection = scaleFactor > 1 ? 1 : -1
        const scale = nowImgInfo.scale + scaleFactor * scaleDirection * 0.1
        nowImgInfo.scale = Math.min(Math.max(1,scale),5)

        // const deltaX = (((evt.touches[0].pageX + evt.touches[1].pageX) / 2) - nowImgInfo.x) * 1.5; // x1.5 for accelarated movement
        // const deltaY = (((evt.touches[0].pageY + evt.touches[1].pageY) / 2) - nowImgInfo.y) * 1.5; // x1.5 for accelarated movement
        const transformScale = `scale(${nowImgInfo.scale})`;
        const img = evt.target as HTMLImageElement
        handleTransform(img,'scale',transformScale)
        if(scale === 1) {
            img.style.transform = transformScale
        }
        
        const outerTranslateX = `translateX(${0})`
        const imgContainer = document.querySelector(".container_scale") as HTMLDivElement
        handleTransform(imgContainer,'translateX',outerTranslateX)
    }
}

function handleEnd(evt: Event) {
    if(isScale || (evt instanceof TouchEvent && evt.touches.length === 2)) {
        isScale = false
        document.removeEventListener("touchmove",handleMove)
    } 
}

function distance(event: TouchEvent) {
    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
};

function handleTransform(img: HTMLElement, transformKey: string ,transformProp: string) {
    const regex = new RegExp(`${transformKey}\\([^)]+\\)`,'g')
    img.style.transform = img.style.transform 
                                ?   img.style.transform.includes(transformKey) 
                                    ? img.style.transform.replace(regex, transformProp)
                                    : img.style.transform += ` ${transformProp}`
                                : transformProp
}

function isExcessBoundryX(img: HTMLImageElement,moveX:number) {
    const browserWitdh = window.innerWidth
    const translateX = moveX * nowImgInfo.scale
    const imgWidth = Number(    
        window.getComputedStyle(img,null)
                .getPropertyValue("width")
                .replace("px","")
    ) * nowImgInfo.scale
    
    // 是否超過右邊界
    const eceesRight = (imgWidth - browserWitdh) / 2 + translateX 
    const isExccesRight = eceesRight < 0
    
    // 是否超過左邊界
    const excessLeft = (imgWidth - browserWitdh) / 2 - translateX
    const isExccesLeft = excessLeft < 0 
    return isExccesRight || isExccesLeft
}