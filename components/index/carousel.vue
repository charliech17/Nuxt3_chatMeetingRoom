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
                <!-- <div class="left_btn innerBtn" @click="() => userTiggerSlide('l')"></div> -->
                <v-icon 
                    :class="{'d-none': !canSlide}"
                    class="left_btn innerBtn" 
                    @click="() => userTiggerSlide('l')"
                    :icon="mdiArrowLeftCircleOutline"
                ></v-icon>
                <img 
                    :id="'image_'+ index"
                    :src="imageName.url" 
                    alt=""
                />
                <div class="comment">{{ imageName.word }}</div>
                <v-icon 
                    :class="{'d-none': !canSlide}"
                    class="right_btn innerBtn" 
                    @click="()=> userTiggerSlide('r')"
                    :icon="mdiArrowRightCircleOutline"
                ></v-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { handleLoop,setPicList,transformStart } from "@/utils/index/index"
    import mdiArrowLeftCircleOutline from '~icons/mdi/arrow-left-circle-outline'
    import mdiArrowRightCircleOutline from '~icons/mdi/arrow-right-circle-outline'

    const canSlide = ref(false)
    const carosuel_id = ref('index_carousel')
    const nowPickList = ref<nowPickListType[]>([])

    type nowPickListType = {
        name: string
        url: any
        word: string
    }

    function handleTransitionEnd() {
        handleLoop(nowPickList,carosuel_id.value,canSlide)
    }

    onMounted(()=> {
        setPicList(nowPickList)
        setTimeout(()=> {
            canSlide.value = false
            transformStart(carosuel_id.value,'r')
        },100)
    })

    function userTiggerSlide(direct: "l" | "r") {
        if(!canSlide.value) return
        canSlide.value = false
        transformStart(carosuel_id.value,direct)
    }

    onBeforeMount(()=> {
        document.getElementById(carosuel_id.value)?.removeEventListener("animationend",handleTransitionEnd)
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
                position: relative;
                img{
                    height: 200px;
                    display: inline-block;
                }

                .comment{
                    height: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    background-color: #0b5993;
                    color: white;
                    padding: 8px;
                    border-radius: 8px;
                    margin-top: 16px;
                    max-width: 300px;
                    @media (min-width: 768px) {
                        margin-top: 24px;
                        font-size: 16px;
                    }
                }

                .innerBtn{
                    position: absolute;
                    top: 30%;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                    opacity: 0.5;
                    color: #3d4a54;
                    transition: all 1.5s;
                    &.left_btn{
                        left: 5%;
                    }
                    &.right_btn {
                        right: 5%;
                    }

                    @media (min-width: 768px) {
                        width: 30px;
                        height: 30px;
                    }
                }
            }
        }
    }
</style>