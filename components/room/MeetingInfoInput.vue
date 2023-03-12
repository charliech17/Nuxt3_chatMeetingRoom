<template>
    <main>
        <div>
            <label class="mr-4" for="roomCode">
                <slot name="meetingCode"></slot>
            </label>
            <BaseInput
                @emitInputVal="(val)=> roomCode = val"
                name="roomCode"
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
    import { checkIsRTDBData, setRTDBData } from '@/utils/firebase/useRTDB'
    import { useAuthStore } from '@/stores/authStore'

    const props = defineProps({
        isFrom: {type: String, required: true},
    })

    const roomCode = ref('')
    const roomPassword = ref('')

    const handleMeetingJoin = async () => {
        if(props.isFrom === 'host') {
            const newMeetingPath = 'room/' + roomCode.value + "/"
            const hostPath       = 'host/' + useAuthStore().uid + "/"//+ new Date().getTime() + "/"
            const isHost     = await checkIsRTDBData(hostPath)
            const isRoomData = await checkIsRTDBData(newMeetingPath)
            if(roomCode.value.length < 6  && roomPassword.value.length < 4) {
                // TODO 換成較UI套件
                alert('請確認會議代碼至少6碼，會議密碼至少4碼')
                return
            }
            else if(isHost) {
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
                    isRoom: true,
                    uuidList: [useAuthStore().uid], 
                }
                const hostMeetingInfo = {
                    createTime: new Date().toString(), 
                } 
                const setMeetingPath = newMeetingPath + roomPassword.value
                const enterMeetingPath = '/room/' + roomCode.value + '_' + roomPassword.value
                await apiService(async () => {
                    await setRTDBData(setMeetingPath,updateMeetingInfo)
                    await setRTDBData(hostPath,hostMeetingInfo)
                    useRouter().push(enterMeetingPath)
                })
            }
        } else {

        }
    }
</script>