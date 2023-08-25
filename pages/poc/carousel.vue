<template>
    <div class="wrapper">
        <div 
            v-if="isAutoPicture"
            class="img_container" 
            @transitionend="handleLoop" 
        >
            <img 
                v-for="(imageName,index) in nowPickList" 
                :id="'image_'+ index"
                :key="imageName.name"
                :src="imageName.url" 
                alt=""
            >
        </div>
        <div 
            v-else
            class="mt-2 container_scale" 
        >
            <img 
                @touchstart="scaleImage"
                src="/testImage/1.jpg" 
                alt=""
            >
            <img 
                style="position: relative;"
                src="/testImage/2.jpg" 
                alt=""
            >
        </div>
        <v-btn @click="startAutoPic">自動滑動相片</v-btn>
        <v-btn @click="startMovePic">手動滑動相片</v-btn>
        <div class="m-4">
            <v-btn @click="openKeyboard">按我</v-btn>
            <input id="inputID" type="text" style="border:1px solid blue;">
        </div>
    </div>
</template>

<script lang="ts" setup>
    useHead({
        meta: [
            {
                name: 'viewport',
                content: "width=device-width, user-scalable=no"
            }
        ]
    })
    interface nowPickListType {
        name: string
        url: any
    }
    let img: undefined | HTMLImageElement;
    let imgContainer: undefined | HTMLDivElement
    let nowTransition = 200
    let orignTransition = 100
    const isAutoPicture = ref(false)
    const allPicList = ["1","2","3","4","5"]
    const nowPickList = reactive<nowPickListType[]>([])
    const baseAssetsPath = "/testImage/"
    const nowImgInfo = {scale: 0, distance: 0, x: 0, y: 0}
    let isScale = false
    setPicList()

    let tyStart:number,tyEnd:number = 0
    let lastPoint = 0
    function scaleImage(event: TouchEvent) {
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

    function distance(event: TouchEvent) {
        return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
    };

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

    function setPicList() {
        const lastItem = allPicList[allPicList.length - 1]
        const firstItem = allPicList[0]
        const secondItem = allPicList[1]
        const imageOrder = [lastItem,firstItem,secondItem]
        
        nextTick(()=> {
            imgContainer = document.querySelector(".img_container")! as HTMLDivElement
            imageOrder.forEach((item) => {
                nowPickList.push({
                    name: item,
                    url:  new URL(baseAssetsPath + item + ".jpg", import.meta.url).href,
                })
            })
        })
    }

    function startAutoPic() {
        isAutoPicture.value = true
        setTimeout(()=> {
            transformStart()
        },1500)
    }

    function transformStart() {
        imgContainer = document.querySelector(".img_container")! as HTMLDivElement
        img = document.getElementById('image_1') as HTMLImageElement
        imgContainer!.style.transition = `transform 1.5s`
        imgContainer.style.transform = `translateX(-${nowTransition}vw)`
    }

    function handleLoop() {
        imgContainer!.style.transition = ``
        
        nowPickList.shift()
        const newData = Number(nowPickList[1].name) + 1
        const finalData = newData > 5 ? 1 : newData
        
        nowPickList.push({
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

    function startMovePic() {
        isAutoPicture.value = false

        nextTick(()=>{
            const container = document.querySelector(".container_scale") as HTMLDivElement
            let ts:number,te:number = 0
            let lastPoint = 0
    
            addEventListener("touchstart",(event)=> {
                ts = event.touches[0].clientX
            })
            addEventListener("touchmove",(event)=> {
                te = event.touches[0].clientX
                container!.style.transform = `translateX(${lastPoint + (te-ts)}px)`
                lastPoint += (te-ts)
                ts = te
            })
        })
    }

    function openKeyboard() {
        document.getElementById("inputID")?.focus()
    }
</script>

<style lang="scss" scoped>
    .wrapper {
        width: calc(100% + 32px);
        height: calc(100% + 32px);
        overflow: hidden;
        margin: -16px;
        .img_container{
            display: flex;
            transform: translateX(-100vw);
        }
        .img_container > img{
            flex-shrink: 0;
            flex-basis: 100vw;
            display: inline-block;
        }

        .container_scale{
            display: flex;
            transition: transform 0.5s cubic-bezier(0.42, 0, 0.49, 1.16);
        }
        .container_scale > img{
            flex-shrink: 0;
            flex-basis: 100vw;
            transition: transform 0.1s linear;
        }
    }
</style>
