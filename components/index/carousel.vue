<template>
    <div class="wrapper">
        <div 
            class="index_img_container" 
            :id="carosuel_id"
            @transitionend="() => handleTransitionEnd()" 
        >
            <div 
                v-for="(imageName,index) in nowPickList" 
                :key="imageName.name"
                class="each_card"
            >
                <img 
                    :id="'image_'+ index"
                    :src="imageName.url" 
                    alt=""
                />
                <div class="mt-1">{{ imageName.word }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { handleLoop,setPicList,transformStart } from "@/utils/index/index"

    const isAutoPicture = ref(false)
    const carosuel_id = ref('index_carousel')
    const nowPickList = ref<nowPickListType[]>([])

    type nowPickListType = {
        name: string
        url: any
        word: string
    }

    function handleTransitionEnd() {
        handleLoop(nowPickList,carosuel_id.value)
    }

    onMounted(()=> {
        setPicList(nowPickList)
        nextTick(()=> {
            transformStart(carosuel_id.value)
        })
    })
</script>

<style lang="scss" scoped>
    .wrapper {
        width: 100%;
        max-width: 800px;
        overflow: hidden;
        margin: 0 auto;
        background-color: white;
        border-radius: 12px;
        .index_img_container{
            width: 100%;
            height: 400px;
            display: flex;
            justify-content: center;
            transform: translateX(-0%);
            border-radius: 12px;
            .each_card {
                width: 100%;
                flex-shrink: 0;
                background-color: white;
                padding: 32px;
                display: flex;
                flex-direction: column;
                align-items: center;
                img{
                    height: 180px;
                    object-fit: contain;
                    flex-shrink: 0;
                    flex-basis: 100%;
                    display: inline-block;
                    @media (min-width: 768px) {
                        height: 150px;
                    }
                }
            }
        }
    }
</style>