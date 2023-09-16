<template>
    <div class="wrapper">
        <div 
            v-if="isAutoPicture"
            class="img_container" 
            @transitionend="() => handleTransitionEnd()" 
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
            id="img_previewer"
            class="mt-2 container_scale" 
        ></div>
        <div class="mt-20">
            <v-btn @click="startAutoPic">自動滑動相片</v-btn>
            <v-btn @click="startMovePic">手動滑動相片</v-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
    import  {   
        init, scaleImage, transformStart, handleLoop
    } from "@/utils/poc/carousel/index"
    import { imgList, nowImgInfo, resetImgInfo } from "@/utils/poc/carousel/touchMove"
    
    interface nowPickListType {
        name: string
        url: any
    }
    const isAutoPicture = ref(false)
    const nowPickList = ref<nowPickListType[]>([])

    function startAutoPic() {
        isAutoPicture.value = true
        setTimeout(()=> {
            transformStart()
        },1500)
    }

    function startMovePic() {
        isAutoPicture.value = false

        nextTick(()=>{
            const container = document.querySelector(".container_scale") as HTMLDivElement
            let startTs = 0
            let ts:number,te:number = 0
            let lastPoint = 0
            let isImgScrollRight = false
            let isOuterMove = false
    
            addEventListener("touchstart",(event)=> {
                ts = event.touches[0].clientX
                startTs = ts
            })
            addEventListener("touchmove",(event)=> {
                isOuterMove = true
                te = event.touches[0].clientX
                container!.style.transform = `translateX(${lastPoint + (te-ts)}px)`
                lastPoint += (te-ts)
                isImgScrollRight = (startTs > te) ? true : false
                ts = te
            })
            addEventListener("touchend",(event)=> {
                if(!isOuterMove) return

                const wInnerWidth = Number(use_deviceInfo_Store().deviceViewWidth)
                const halfIW = wInnerWidth / 2
                if(isImgScrollRight) {
                    // 判斷是否移動到超過下一張的1/2
                    if( lastPoint < -(nowImgInfo.nowIndex*wInnerWidth + halfIW)
                        && nowImgInfo.nowIndex !== (imgList.length - 1)
                    ) {
                        const orignIndex = nowImgInfo.nowIndex
                        nowImgInfo.nowIndex += 1
                        const newTransX = nowImgInfo.nowIndex * wInnerWidth
                        container!.style.transform = `translateX(-${newTransX}px)`
                        setTimeout(()=> {
                            const img = document.getElementById(`imagePreview_img_${orignIndex + 1}`)!
                            resetImgInfo(img)
                        },200)
                    } else {
                        const orignTransX = nowImgInfo.nowIndex * wInnerWidth
                        container!.style.transform = `translateX(-${orignTransX}px)`
                    }
                } else {
                    if( lastPoint > -(nowImgInfo.nowIndex*wInnerWidth - halfIW)
                        && nowImgInfo.nowIndex !== 0
                    ) {
                        const orignIndex = nowImgInfo.nowIndex
                        nowImgInfo.nowIndex -= 1
                        const newTransX = nowImgInfo.nowIndex * wInnerWidth
                        container!.style.transform = `translateX(-${newTransX}px)`
                        nextTick(()=> {
                            const img = document.getElementById(`imagePreview_img_${orignIndex + 1}`)!
                            resetImgInfo(img)
                        })
                    } else {
                        const orignTransX = nowImgInfo.nowIndex * wInnerWidth
                        container!.style.transform = `translateX(-${orignTransX}px)`
                    }
                }

                isOuterMove = false
            })
        })
    }

    function appendAllImg() {
        nextTick(()=> {
            imgList.forEach((item)=> {
                const img = document.createElement("img")
                img.src = `/testImage/${item}.jpg`
                img.classList.add("imgPreviewer__innerImg")
                img.addEventListener("touchstart",scaleImage)
                img.id = `imagePreview_img_${item}`
                const img_previewer = document.getElementById("img_previewer")!
                img_previewer.appendChild(img)
            })
        })
    }

    function handleTransitionEnd() {
        handleLoop(nowPickList)
    }

    init(nowPickList)
    appendAllImg()
    startMovePic()
</script>

<style lang="scss">
    .imgPreviewer__innerImg{
        flex-shrink: 0;
        flex-basis: 100vw;
        transition: transform 0.1s linear;
    }
</style>

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
        // .container_scale > img{
        //     flex-shrink: 0;
        //     flex-basis: 100vw;
        //     transition: transform 0.1s linear;
        // }
    }
</style>