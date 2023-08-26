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
        <div class="mt-20">
            <v-btn @click="startAutoPic">自動滑動相片</v-btn>
            <v-btn @click="startMovePic">手動滑動相片</v-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import  {   
        init, scaleImage, transformStart, handleLoop
    } from "@/utils/poc/carousel/index"
    
    interface nowPickListType {
        name: string
        url: any
    }
    const isAutoPicture = ref(false)
    const nowPickList = ref<nowPickListType[]>([])
    init(nowPickList)


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

    function handleTransitionEnd() {
        handleLoop(nowPickList)
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
~~/utils/poc/carousel/carousel