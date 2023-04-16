<template>
    <div>
        <h1>{{ '*是否有會議? ' + (isRoomInfo ? '是' : '否')  }}</h1>
        <div v-if="isRoomInfo" class="mt-4">
            <h2>*創建時間: {{ roomInfo?.createTime }}</h2>
            <div class="mt-4">
                <h2>*會議QR Code:</h2>
                <img :src="QRCodeURL" class="mt-4 text-center mx-auto" width="164" height="164" alt="">
            </div>
            <v-btn :prepend-icon="mdiShare" color="purple-darken-4" class="mt-4 text-purple-lighten-3" block>分享會議連接</v-btn>
            <v-btn :prepend-icon="mdiNavigationVariantOutline" class="mt-4" block @click="navigateTo(roomInfo?.roomPath)">前往會議</v-btn>
            <h3 class="text-red text-center text-lg mt-8">Danger Zone</h3>
            <v-btn class="mt-2 text-h6" color="red" block @click="isShowAlertDialog = true">刪除此會議</v-btn>
            <v-dialog
                v-model="isShowAlertDialog"
                transition="dialog-bottom-transition"
                content-class="bg-white p-4"
                width="auto"
            >
                <v-card>
                    <h2>確定刪除會議?</h2>
                    <p>若仍有人在會議可能會導致斷訊</p>
                    <v-btn @click="handleDeleteMeeting">確定刪除</v-btn>
                    <v-btn @click="isShowAlertDialog = false">關閉彈窗</v-btn>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import mdiShare from '~icons/mdi/share'
    import mdiNavigationVariantOutline  from '~icons/mdi/navigation-variant-outline'
    // @ts-ignore
    import QRCode from 'qrcode'
    import { getRTDBData } from '@/utils/firebase/useRTDB'
    import { useAuthStore } from '@/stores/authStore';
    
    const isRoomInfo = ref<null | boolean>(null)
    const roomInfo = ref<null | {createTime: Date, roomPath: string}>(null)
    const QRCodeURL = ref<string>('')
    const isShowAlertDialog = ref(false)
    
    
    const handleDeleteMeeting = () => {
        alert('TODO 刪除邏輯 彈窗樣式')
        isShowAlertDialog.value = false
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