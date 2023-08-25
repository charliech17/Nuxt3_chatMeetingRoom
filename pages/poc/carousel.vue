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
            <img src="/testImage/1.jpg" alt="">
            <img src="/testImage/2.jpg" alt="">
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
    interface nowPickListType {
        name: string
        url: any
    }
    let img: undefined | HTMLImageElement;
    let imgContainer: undefined | HTMLDivElement
    let nowTransition = 200
    let orignTransition = 100
    const isAutoPicture = ref(true)
    const allPicList = ["1","2","3","4","5"]
    const nowPickList = reactive<nowPickListType[]>([])
    const baseAssetsPath = "/testImage/"
    setPicList()
    

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
        }

        .container_scale{
            display: flex;
            transition: transform 0.5s;
        }
        .container_scale > img{
            flex-shrink: 0;
            flex-basis: 100vw;
        }
    }
</style>
