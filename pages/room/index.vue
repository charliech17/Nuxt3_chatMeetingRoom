<template>
    <div>
        <section>
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
        <section class="mt-4">
            <RoomMeetingInfoInput v-if="isShowSetting">
                <template v-slot:meetingCode>設定會議代碼</template>
                <template v-slot:meetingPassword>設定會議密碼</template>
            </RoomMeetingInfoInput>
            <RoomMeetingInfoInput v-if="isShowInput">
                <template v-slot:meetingCode>輸入會議代碼</template>
                <template v-slot:meetingPassword>輸入會議密碼</template>
            </RoomMeetingInfoInput>
        </section>
    </div>
</template>

<script lang="ts" setup>
    const isShowSetting = ref(false)
    const isShowInput   = ref(false)
    

    function handleAddMeeting() {
        isShowSetting.value = !isShowSetting.value
        isShowInput.value   = false
    }

    function handleJoinMeeting() {
        isShowInput.value   = !isShowInput.value
        isShowSetting.value = false
    }

</script>

