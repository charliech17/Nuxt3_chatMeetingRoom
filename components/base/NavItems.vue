<template>
    <v-list-item 
        v-if="use_deviceInfo_Store().isMobile"
        v-for="info in listInfo"
        class="py-5 clickEffect" 
        :key="info.value"
        :value="info.value" 
        :prepend-icon="info.icon" 
        :title="info.title" 
        @click="info.clickAction"
    />
    <div 
        v-else
        class="flex"
    >
        <span 
            v-for="info in listInfo"
            :value="info.value" 
            class="mr-3 p-2 cursor-pointer hover:bg-yellow-600 rounded-lg"
            @click="info.clickAction"
        >{{ info.title }}</span>
    </div>
</template>

<script lang="ts" setup>
import { headerMdiIcons } from '@/utils/icons/HeaderIconUtils'
import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'


const emit = defineEmits(['changeShowDrawer'])

const listInfo = ref([
    // {
    //     icon: headerMdiIcons.mdiBookEducationOutline,
    //     title: "切換色系",
    //     value: "colorChange",
    //     clickAction: ()=> handleMenuDraweItems('changeColor')
    // },
    {
        icon: headerMdiIcons.mdiLaptopAccount,
        title: "視訊通話試用",
        value: "colorChange",
        clickAction: ()=> handleMenuDraweItems('tryVedioCall')
    },
    {
        icon: headerMdiIcons.mdiAccountGroup,
        title: "前往會議資訊",
        value: "room",
        clickAction: ()=>handleMenuDraweItems('room')
    },
    {
        icon: headerMdiIcons.mdiBookEducationOutline,
        title: "前往使用說明",
        value: "education",
        clickAction: ()=>handleMenuDraweItems('education')
    },
    {
        icon: headerMdiIcons.mdiCurrencyUsd,
        title: "贊助",
        value: "sponser",
        clickAction: ()=>handleMenuDraweItems('sponser')
    }
])

const handleMenuDraweItems = async (triggerItems: 'room' | 'education' | 'sponser' | 'tryVedioCall' ) => {
    switch(triggerItems) {
        case 'tryVedioCall':
            emit("changeShowDrawer",false)
            apiService(()=> {
                return new Promise(()=> {
                    navigateTo("https://webrtc-chatroom.netlify.app/",{external: true})
                })
            })
            break
        case 'room' :
            navigateTo('/room')
            emit("changeShowDrawer",false)
            break
        case 'education':
            emit("changeShowDrawer",false)
            // TODO 導至教學頁面
            if(useRouter().currentRoute.value.name === "index") {
                scrollToEducation()
            } else {
                navigateTo("/")
                setTimeout(()=> {
                    scrollToEducation()
                },200)
            }
            function scrollToEducation() {
                const teach_part_wrapper = document.getElementById("teach_part_wrapper")!
                const toPosition = getScrollPosition() + teach_part_wrapper.getBoundingClientRect().top - calHeaderHeight()
                smoothScroll(toPosition,"mainContent_scrollSection_ID")
            }
            break
        case 'sponser':
            emit("changeShowDrawer",false)
            navigateTo('/donation')
            break
    }
}

</script>