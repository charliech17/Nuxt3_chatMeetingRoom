<template>
    <div class="cover_sectionStyle">
        <div class="input-wrapper">
            <input aria-label="Ask us anything">
            <span class="placeholder"></span>
        </div>
    </div>
    <section>
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
        <v-img
            src="https://picsum.photos/1920/1081?nature"
            width="100%"
            class="bg-grey-lighten-2 mt-4"
            :lazy-src="`https://picsum.photos/10/6`"
        ></v-img>
    </section>
</template>


<script lang="ts" setup>
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
    
    onBeforeRouteLeave(()=> {
        document.body.style.backgroundColor = ''
    })
</script>

<style lang="scss" scoped>
    @import '@/assets/css/typed.scss';


    .cover_sectionStyle{
        margin: -16px -16px auto -16px;
        width: calc(100vw);
        height: calc( (3223 / 4976) * (100vw) );
        background-image: url('~/assets/image/index_cover1.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }
    .input-wrapper {
        display: block;
        font-family: monospace;
        font-size: 125%;
        width: 75%;
        margin-left: 16px;
        color: #6A1B9A;
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
            @include typed(
            (
                "Want to have video chat with other easily on website ?": (color: #EDE7F6, background: #6200ee),
                "Want to Join many people meetings easily without any app ?": (color: #EDE7F6, background: #6200ee),
                "The answer, chatApp!": (color: #EDE7F6, background: #6200ee),
            ),
            1.5,
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