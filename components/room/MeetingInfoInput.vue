<template>
    <main>
        <div>
            <label class="mr-4" for="roomName">
                <slot name="meetingCode"></slot>
            </label>
            <BaseInput
                @emitInputVal="(val)=> roomName = val"
                name="roomName"
                type="number"
            />
        </div>
        <div>
            <label class="mr-4" for="roomPassword">
                <slot name="meetingPassword"></slot>
            </label>
            <BaseInput
                @emitInputVal="(val)=> roomPassword = val"
                name="roomPassword"
                type="password"
            />
        </div>
        <div class="mt-4">
            <v-btn variant="outlined" @click="handleMeetingJoin">
                <slot name="meetingBtn"></slot>
            </v-btn>
        </div>
    </main>
</template>

<script lang="ts" setup>
    import { getRTDBData, setRTDBData } from '@/utils/firebase/useRTDB'
    import { useAuthStore } from '@/stores/authStore'

    const props = defineProps({
        isFrom: {type: String, required: true},
    })

    const roomName = ref('')
    const roomPassword = ref('')

    const handleMeetingJoin = async () => {
        if(props.isFrom === 'host') {
            const newMeetingPath = 'room/' + roomName.value + "/"
            const hostPath       = 'host/' + useAuthStore().uid + "/"//+ new Date().getTime() + "/"
            const isHost     = await getRTDBData(hostPath)
            const isRoomData = await getRTDBData(newMeetingPath)
            if(isHost) {
                // TODO 換成較UI套件
                alert('您已有會議')
                return
            } else if(isRoomData) {
                // TODO 換成較UI套件
                alert('此組會議名稱已有人使用')
                return
            } else {
                // TODO 改成UUID套件，加上會議名稱、主持人名稱
                const updateMeetingInfo = { 
                    uuid: useAuthStore().uid, 
                }
                const hostMeetingInfo = {
                    createTime: new Date().toString(), 
                } 
                const setMeetingPath = newMeetingPath + roomPassword.value
                await setRTDBData(setMeetingPath,updateMeetingInfo)
                setRTDBData(hostPath,hostMeetingInfo)
            }
        } else {

        }
    }
</script>