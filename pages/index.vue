<template>
    <div>
        <section class="cover_bg" ref="first_part">
            <div class="cover_sectionStyle">
                <h1 class="h1_style">The Chat App</h1>
                <div class="input-wrapper">
                    <input aria-label="Ask us anything">
                    <span class="placeholder"></span>
                </div>
                <div class="first_img_part">
                    <img :class="{'img_show': showImg.img1}" src="/index/main.gif" alt="">
                </div>
                <v-icon 
                    :icon="indexImg.mdiArrowDown" 
                    class="go_next_part" 
                    @click="goNextpart"
                ></v-icon>
            </div>
        </section>
        <section class="outer_wrapper">
            <div class="text-center mt-8">
                <div class="flex justify-center align-center gap-2">
                    <v-icon color="#07304e" :icon="isAuth ? indexImg.mdiEmoticonOutline : indexImg.mdiHelpCircleOutline"></v-icon>
                    <h1 class="text-2xl">{{isAuth ? '開始使用' : '有帳號嗎'}}</h1>
                </div>
                <div class="mt-4">
                    <v-btn rounded="lg" class="mr-4" v-if="!isAuth" @click="navigateTo('login')">登入</v-btn>
                    <v-btn rounded="lg" v-if="!isAuth" @click="navigateTo('/login/register')">註冊</v-btn>
                    <v-btn rounded="lg" class="mr-4" v-if="isAuth" @click="navigateTo('/room')">前往我的會議</v-btn>
                    <v-btn rounded="lg" v-if="isAuth" @click="navigateTo('/userInfo')">前往更改設定</v-btn>
                </div>
            </div>
            <div class="mt-4">
                <div class="font-sans flex align-top justify-between flex-col md:flex-row px-10 md:px-20 md:gap-x-4 intoColorStyle">
                    <div class="mt-8 md:flex-1" v-for="(parameter,index) in topAttractiveParamenters" :key="index">
                        <img
                            class="block mx-auto"
                            width="64"
                            height="64"
                            :src="parameter.imgPath"
                        />
                        <h2 class="text-center text-2xl mt-2">{{parameter.titleTxt}}</h2>
                        <p class="mt-2">{{ parameter.contentTxt }}</p>
                    </div>
                </div>
                <div class="mt-20 md:mb-16">
                    <h2 class="text-center text-2xl">使用心得</h2>
                    <Carousel class="mt-4"/>
                </div>
            </div>
        </section>
    </div>
</template>


<script lang="ts" setup>
    import { useAuthStore } from '@/stores/authStore'
    // import mdiEmoticonOutline from '~icons/mdi/emoticon-outline'
    // import mdiHelpCircleOutline from '~icons/mdi/help-circle-outline'
    import {indexImg} from "@/utils/icons/index"
    import Carousel from "@/components/index/carousel.vue"

    const showImg = ref({
        img1: false,
        img2: false,
        img3: false,
        img4: false
    })
    const first_part = ref<HTMLElement|null>(null)
    const topAttractiveParamenters = reactive([
        {
            imgPath: new URL('@/assets/image/icon/index_easy.png', import.meta.url).href,
            titleTxt: 'Esay to use',
            contentTxt: 'All you need is sign an account, and you can use our chatApp to connect to others',
        },
        {
            imgPath: new URL('@/assets/image/icon/index_fast.png', import.meta.url).href,
            titleTxt: 'Fast connections',
            contentTxt:'Connect to others very fast with live stream including video and audio',
        },
        {
            imgPath: new URL('@/assets/image/icon/index_free.png', import.meta.url).href,
            titleTxt: 'Free to use',
            contentTxt:'No need money, just enjoy your connection!',
        }
    ])
    document.body.style.backgroundColor = '#EDE7F6'
    document.body.style.color = '#333333'
    
    
    const isAuth = computed(()=> {
        return useAuthStore().isAuth
    })

    onMounted(()=> {
        setTimeout(()=>{
            for(const key in showImg.value) {
                // @ts-ignore
                // console.log(showImg.value[key])
                showImg.value[key] = true
            }
        },100)
    })
    onUnmounted(()=> {
        document.body.style.backgroundColor = ''
        document.body.style.color = ''
    })

    function goNextpart() {
        const scrollSection = document.getElementById('mainContent_scrollSection_ID')
        const moveTop = first_part.value!.getBoundingClientRect().bottom 
                        + scrollSection!.scrollTop
                        - calHeaderHeight()
        smoothScroll(moveTop,'mainContent_scrollSection_ID',2) // 用原生scrollTo() 在ios上沒有smooth效果
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/css/typed.scss';

    .cover_bg{
        background-color: white;
        margin: auto -16px;
        max-height: calc(var(--vh,1vh)*100 - 64px);
        height: calc( (3223 / 4976) * (100vw) );
    }

    .cover_sectionStyle{
        position: relative;
        margin: -16px auto 0 auto;
        width: 100%;
        height: 100%;
        max-width: 1024px;
        background-color: white;

        .first_img_part {
            position: relative;
            width: 100%;
            height: 100%;

            img {
                position: absolute;
                width: 150px;
                transition: 1.5s;
                @media (min-width: 768px) {
                    width: 400px;
                    opacity: 0.2;
                    pointer-events: none;
                }
            }

            img:nth-child(1) {
                right: 5%;
                top: 20%;
                @media (min-width: 768px) {
                    right: 10%;
                    top: 20%;
                }
            }

            .img_show {
                opacity: 1;
            }
        }

        .go_next_part{
            position: absolute;
            bottom: 25px;
            left: 50%;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            transform: translateX(-50%);
            animation: 1s shine_animate infinite alternate;
            cursor: pointer;
            display: none;

            @media (min-width: 768px) {
                display: block;
            }

            @keyframes shine_animate {
                0% {
                    // opacity: 0;
                    color: #012580;
                    transform: translateY(-10px);
                }

                100% {
                    color: #678ae1;
                    transform: translateY(10px);
                }
            }
        }
    }

    .h1_style{
        font-size: 1.5rem;
        position: absolute;
        top: 30%;
        transform: translateY(-50%);
        margin-left: 1.5rem;
        @media (min-width: 768px) {
            margin-left: 1.5rem;
            font-size: 3rem;
        }
    }
    .outer_wrapper{
        max-width: 1200px;
        margin: 0 auto;
    }
    .input-wrapper {
        display: block;
        position: absolute;
        top: 35%;
        transform: translateY(-50%);
        height: 30px;
        font-family: monospace;
        font-size: 1.2rem;
        width: 60%;
        margin-left: 16px;
        color: #6A1B9A;
        @media(min-width: 768px) {
            width: 55%;
            font-size: 2rem;
        }
        > input,
        > .placeholder {
            display: block;
            appearance: none;
            width: fit-content;
            height: 100%;
            background-color: transparent;
            border: none;
        }
        > .placeholder {
            pointer-events: none;
            border-radius: 5px;
            padding: 5px;
            @include typed(
            (
                "Want to have video chat with other easily on website ?": (color: #EDE7F6, background: #415ca1),
                "Want to Join many people meetings easily without any app ?": (color: #EDE7F6, background: #415ca1),
                "The answer, chatApp!": (color: #EDE7F6, background: #415ca1),
            ),
            4,
            (
                caret-width: 2px,
                caret-space: 2px,
            )
            );
        }
        > input {
            &:focus,
            &:active {
                + .placeholder {
                    display: none;
                }
            }
        }
    }

    .intoColorStyle{
        h2{
            color: #012580;
        }
        p {
            color: black;
        }
    }
</style>