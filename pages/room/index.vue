<template>
    <div class="wrapper_style">
        <section class="text-center">
            <button
                v-if="isUserLogin"
                @click="handleMyMeeting"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
                我的會議
            </button>
            <button 
                @click="handleAddMeeting"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
                新增會議室
            </button>
            <button 
                @click="handleJoinMeeting"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                加入會議室
            </button>
        </section>
        <section class="mt-4 text-md-center mt-md-8">
            <MyMeeting v-if="isShowMyMeetings"/>
            <RoomMeetingInfoInput :isFrom="'host'" v-if="isShowSetting">
                <template v-slot:meetingCode>設定會議代碼</template>
                <template v-slot:meetingPassword>設定會議密碼</template>
                <template v-slot:meetingBtn>開始會議</template>
            </RoomMeetingInfoInput>
            <RoomMeetingInfoInput :isFrom="'guest'" v-if="isShowInput">
                <template v-slot:meetingCode>輸入會議代碼</template>
                <template v-slot:meetingPassword>輸入會議密碼</template>
                <template v-slot:meetingBtn>進入會議</template>
            </RoomMeetingInfoInput>
        </section>
    </div>
</template>

<script lang="ts" setup>
    import MyMeeting from '@/components/room/MyMeeting.vue'
    import { watchLoginStatus } from '@/utils/baseUtils'

    const isShowSetting = ref(false)
    const isShowInput   = ref(true)
    const isShowMyMeetings = ref(false)
    const isUserLogin = ref<null | boolean>(null)
    

    function handleAddMeeting() {
        isShowSetting.value = !isShowSetting.value
        isShowInput.value   = false
        isShowMyMeetings.value = false
    }

    function handleJoinMeeting() {
        isShowInput.value   = !isShowInput.value
        isShowSetting.value = false
        isShowMyMeetings.value = false
    }

    function handleMyMeeting() {
        isShowMyMeetings.value   = !isShowMyMeetings.value
        isShowInput.value   = false
        isShowSetting.value = false
    }


    async function getAuthStatus() {
        const isLogin = await watchLoginStatus()
        if(isLogin)  {
            isUserLogin.value = true
            isShowMyMeetings.value = true
            isShowInput.value = false
        } else {
            isUserLogin.value = false
        }
    }


    getAuthStatus()
</script>

<style lang="scss" scoped>
    .wrapper_style{
        max-width: 600px;
        margin: auto;
        @media (min-width: 768px) {

        }
    }
</style>

