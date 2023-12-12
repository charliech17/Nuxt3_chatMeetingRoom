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
                <div class="mt-20" ref="teact_part_wrapper" id="teact_part_wrapper">
                    <div ref="teact_part" id="teact_part">
                        <h2 class="text-center text-2xl" ref="teach_part_title">步驟教學</h2>
                        <div class="mt-4">
                            <img 
                                ref="teach_img"
                                id="teach_img"
                                @load="handleLoadImg"
                                style="max-width: none;max-height: 600px;"  
                                src="/index/teach.png" 
                                alt=""
                            >
                        </div>
                    </div>
                </div>
                <div class="mt-20 md:mb-16">
                    <h2 class="text-center text-2xl">使用心得</h2>
                    <Carousel class="mt-4"/>
                </div>
                <div class="mt-20 md:mb-16">
                    <h2 class="text-center text-2xl">表達心情</h2>
                    <div>
                        <div class="reaction-icon-style">
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="true"
                                location="top"
                            >
                                <template v-slot:activator="{ props }">
                                    <v-icon 
                                        :icon="indexImg.mdiEmoticonHappyOutline"  
                                        v-bind="props"
                                    ></v-icon>
                                </template>
                                <v-card class="ml-2 d-flex pa-3 gap-3">
                                    <div 
                                        v-for="items in moodItems"
                                        :key="items.id"
                                        class="moodItem-style"
                                        @click="() => handleMoodClick(items.id)"
                                    >{{ items.icon }}</div>
                                </v-card>
                            </v-menu>
                        </div>
                        <div class="d-flex justify-center mt-4 gap-2">
                            <div v-for="item,index in moodItems" :key="index" class="text-lg">
                                <span class="mr-2">{{ item.icon }}</span>
                                <span>{{ item.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<script lang="ts" setup>
    import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
    import { useAuthStore } from '@/stores/authStore'
    import {indexImg} from "@/utils/icons/index"
    import Carousel from "@/components/index/carousel.vue"
    import { initTeachPart } from "@/utils/index/leftScroll"
    import { getRTDBData, setRTDBData, listenSpecifyDataChange } from "@/utils/firebase/useRTDB"

    const {isMobile} = use_deviceInfo_Store()
    const showImg = ref({
        img1: false,
        img2: false,
        img3: false,
        img4: false
    })
    const first_part = ref<HTMLElement|null>(null)
    const teach_img = ref<HTMLElement|null>(null)
    const teact_part = ref<HTMLElement|null>(null)
    const teach_part_title = ref<HTMLElement|null>(null)
    const teact_part_wrapper = ref<HTMLElement|null>(null)
    const menu = ref(false)
    const moodItems = ref([
        {icon:"👍",isSelect: false, id: "thumb_up",count:0},
        {icon:"❤️",isSelect: false, id: "love",count:0},
        {icon:"🎉",isSelect: false, id: "celebrate",count:0},
        {icon:"🚀",isSelect: false, id: "rocket",count:0},
        {icon:"👀",isSelect: false, id: "eyes",count:0}
    ])
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

    type moodHasType = [{id:string,count: number}]
    type moodDataType = moodHasType | null
    document.body.style.backgroundColor = '#EDE7F6'
    document.body.style.color = '#333333'
    
    
    const isAuth = computed(()=> {
        return useAuthStore().isAuth
    })

    onMounted(async ()=> {
        setTimeout(()=>{
            for(const key in showImg.value) {
                //@ts-ignore
                showImg.value[key] = true
            }
        },100)
        
        await nextTick(()=> {})
        initTeachPart()

        const path = import.meta.env.VITE_FIREBASE_MOOD_SOCKET as string
        listenSpecifyDataChange(
            path,
            (moodData: moodDataType)=> {
                if(moodData && moodData.length > 0) {
                    console.log(moodData)
                    updateMoodDisplay(moodData)
                }
            },
            ''
        )

        const hasVoted = localStorage["client_id"] as number
        const canVote = (hasVoted && (new Date(hasVoted).getTime() > new Date().getTime()))
        if(canVote) {
            localStorage.removeItem("client_id")
        }
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

    function handleLoadImg(evt:Event) {
        if(!isMobile) return
        teact_part_wrapper.value!.style.height = `${(teact_part.value!.clientHeight) + teach_img.value!.scrollWidth}px`
        teact_part.value!.style.position = "sticky"
        teact_part.value!.style.top = `0%`
        teach_part_title.value?.classList.add("sticky-title")
    }

    function updateMoodDisplay(moodData: moodDataType) {
        if(!moodData || moodData.length <= 0) return 
        moodItems.value.forEach((item)=> {
            let index = 0
            for(const fetchMood of moodData) {
                if(item.id === fetchMood.id) {
                    item.count = fetchMood.count
                    break
                }
                index += 1
            }
            if(index < moodData.length) {
                moodData.splice(index,1)
            }
        })
    }

    async function handleMoodClick(moodId: string) {
        const path = import.meta.env.VITE_FIREBASE_MOOD_SOCKET as string
        if(!localStorage["client_id"]) {
            const data = await getRTDBData(path,'') as moodDataType
            if(!data) {
                const updateData = [{id:moodId,count: 1}]
                setRTDBData(path,updateData,'')
            } else {
                const needUpdateMood = data?.find(moodItem => moodItem.id === moodId)
                const updateData = needUpdateMood 
                    ?  ((needUpdateMood.count += 1) && data) as moodHasType
                    :  (data.push({id:moodId,count: 1}) && data) as moodHasType
                setRTDBData(path,updateData,'')
            }
            // localStorage["client_id"] = new Date().getTime() +  (24 * 60 * 60 * 1000)
            // localStorage["select_mood"] = moodId
        }
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

    #teact_part{
        overflow-x: auto;
    }

    .hide_scrollBar {
        &::-webkit-scrollbar {
            display: none;
        }
    }

    .sticky-title{
        position: sticky;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
    }

    .reaction-icon-style{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid rgb(104, 98, 98);
        text-align: center;
        margin: 16px auto 0;
        cursor: pointer;
        &:hover{
            background-color: #415ca1;
            color: white;
        }
    }
    
    .moodItem-style{
        cursor: pointer;
        padding: 4px;
        &:hover{
            background-color: #f3f0f7;
        }
    }
</style>