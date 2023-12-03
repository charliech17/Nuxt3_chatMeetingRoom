<template>
    <div>
        <section class="cover_bg">
            <div class="cover_sectionStyle">
                <h1 class="h1_style">The Chat App</h1>
                <div class="input-wrapper">
                    <input aria-label="Ask us anything">
                    <span class="placeholder"></span>
                </div>
            </div>
        </section>
        <section class="outer_wrapper">
            <div class="text-center mt-8">
                <div class="flex justify-center align-center gap-2">
                    <v-icon color="#8a2be2" :icon="isAuth ? mdiEmoticonOutline : mdiHelpCircleOutline"></v-icon>
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
                <div class="md:flex gap-2 mt-8">
                    <v-img
                        src="https://picsum.photos/1920/1081?nature1"
                        class="bg-grey-lighten-2 mt-4"
                        :lazy-src="`https://picsum.photos/10/6`"
                    ></v-img>
                    <v-img
                        src="https://picsum.photos/1920/1081?nature2"
                        class="bg-grey-lighten-2 mt-4 d-none d-md-block"
                        :lazy-src="`https://picsum.photos/10/6`"
                    ></v-img>
                </div>
            </div>
        </section>
    </div>
</template>


<script lang="ts" setup>
    import { useAuthStore } from '@/stores/authStore'
    import mdiEmoticonOutline from '~icons/mdi/emoticon-outline'
    import mdiHelpCircleOutline from '~icons/mdi/help-circle-outline'

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


    onUnmounted(()=> {
        document.body.style.backgroundColor = ''
        document.body.style.color = ''
    })
</script>

<style lang="scss" scoped>
    @import '@/assets/css/typed.scss';

    .cover_bg{
        background: linear-gradient(#D1C4E9,#EDE7F6,#ccb0fd,#F3E5F5) ;
        margin: auto -16px;
    }

    .cover_sectionStyle{
        position: relative;
        margin: -16px auto 0 auto;
        width: calc(100vw);
        height: calc( (3223 / 4976) * (100vw) );
        // max-width: calc((4976/3223) * (var(--vh,1vh)*100 - 64px));
        max-height: calc(var(--vh,1vh)*100 - 64px);
        background-image: url('@/public/index_mb_bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        @media (min-width: 768px) {
            background-image: url('@/public/index_bg.png');
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
        top: 55%;
        transform: translateY(-50%);
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
                "Want to have video chat with other easily on website ?": (color: #EDE7F6, background: #6200ee),
                "Want to Join many people meetings easily without any app ?": (color: #EDE7F6, background: #6200ee),
                "The answer, chatApp!": (color: #EDE7F6, background: #6200ee),
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
            color: #8a2be2;
        }
        p {
            color: black;
        }
    }
</style>