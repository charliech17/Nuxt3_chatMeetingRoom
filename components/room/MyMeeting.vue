<template>
    <div>
        <h1 class="text-left">{{ '*是否有會議? ' + (isRoomInfo ? '是' : '否')  }}</h1>
        <div v-if="isRoomInfo" class="mt-4 text-left">
            <h2>*創建時間: {{ roomInfo?.createTime }}</h2>
            <div class="mt-4">
                <h2>*會議QR Code:</h2>
                <img :src="QRCodeURL" class="mt-4 text-center mx-auto" width="164" height="164" alt="">
            </div>
            <div class="mt-4 text-center">
                <v-btn :prepend-icon="mdiShare" color="purple-darken-4" class="text-purple-lighten-3 mr-4" style="width: 150px;">分享會議連接</v-btn>
                <v-btn :prepend-icon="mdiNavigationVariantOutline" @click="navigateTo(roomInfo?.roomPath)" style="width: 150px;">前往會議</v-btn>
            </div>
            <h3 class="text-red text-center text-lg mt-16 rounded-lg">~~ Danger Zone ~~</h3>
            <div class="mx-auto text-center mt-4">
                <v-btn class="text-h6 rounded-lg mx-auto" color="red" @click="isShowAlertDialog = true" block min-width="300">刪除此會議</v-btn>
            </div>
            <v-dialog
                v-model="isShowAlertDialog"
                transition="dialog-bottom-transition"
                content-class="bg-white p-4"
                width="auto"
            >
                <h2>確定刪除會議?</h2>
                <p>若仍有人在會議可能會導致斷訊</p>
                <v-btn variant="tonal" color="red" class="mt-2" @click="handleDeleteMeeting">確定刪除</v-btn>
                <v-btn variant="outlined" color="purple-darken-4" class="text-purple-lighten-3 mt-1" @click="isShowAlertDialog = false">關閉彈窗</v-btn>
            </v-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import mdiShare from '~icons/mdi/share'
    import mdiNavigationVariantOutline  from '~icons/mdi/navigation-variant-outline'
    // @ts-ignore
    import QRCode from 'qrcode'
    import { getRTDBData, deleteRTDBData } from '@/utils/firebase/useRTDB'
    import { useAuthStore } from '@/stores/authStore';
    
    const isRoomInfo = ref<null | boolean>(null)
    const roomInfo = ref<null | {createTime: Date, roomPath: string}>(null)
    const QRCodeURL = ref<string>('')
    const isShowAlertDialog = ref(false)
    
    
    const handleDeleteMeeting = () => {
        isShowAlertDialog.value = false
        if(roomInfo.value?.roomPath) {
            deleteRTDBData(roomInfo.value.roomPath.replace('_','/'))
            deleteRTDBData('host/' + useAuthStore().uid)
            isShowAlertDialog.value = false
            location.reload()
        }
    }

    const setRoomPath = async () => {
        const userRoomPath = 'host/' + useAuthStore().uid
        const getRoomInfo = await getRTDBData(userRoomPath) as {createTime: Date, roomPath: string} | null
        if(getRoomInfo) {
            roomInfo.value = getRoomInfo
            isRoomInfo.value = true
        } else {
            isRoomInfo.value = false
        }

        return getRoomInfo
    }


    const generateQR = async (url: string) => {
        try {
            QRCodeURL.value = await QRCode.toDataURL(url)
            // console.log(await QRCode.toDataURL(text))
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }


    const initMyRoom = async() => {
        const getRoomInfo = await setRoomPath()
        if(getRoomInfo){
            const getUrl = window.location;
            const baseUrl = getUrl.protocol + "//" + getUrl.host;
            await generateQR(baseUrl + getRoomInfo.roomPath)
        }
    }
    initMyRoom()

</script>