<template>
    <div>
        <div>{{hasDisplayName ? '更新' :'設定' }}個人資料</div>
        <v-text-field 
            :rules="[(inputName)=> !inputName.value || '尚未輸入名稱']"
            v-model="newDisplayName"
            label="顯示名稱"
            prepend-icon="mdi-account"
        />
        <v-file-input
            :rules="fileRules"
            v-model="imgFile"
            @change="inputImgFile"
            prepend-icon="mdi-camera"
            accept="image/*"
            clearable
            show-size
            counter
            label="File input"
        />
        <div>
            <div>
                目前的圖片，新增後的圖片後顯示如下:
            </div>
            <v-img
                :src="displayImgSrc"
                width="100%"
                class="bg-grey-lighten-2 mt-4"
            ></v-img>
        </div>
        <v-btn
        class="mt-4"
            block
            prepend-icon="mdi-vuetify" 
            variant="tonal"
            @click="confirmData"
        >
            確認資訊
        </v-btn>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore'
import { uploadFile, deleteAllFolderFiles } from '@/utils/firebase/useStorage'
import { updateUserInfo } from '@/utils/firebase/auth'
import { storeToRefs } from 'pinia'

const { photoURL } = storeToRefs(useAuthStore())
watch(photoURL, () => {
    if(photoURL.value) {
        displayImgSrc.value = photoURL.value
    }
})

const newDisplayName = ref('') as Ref<string | null>
const hasDisplayName = computed(() => {
    const userDisplayName = useAuthStore().displayName
    newDisplayName.value = userDisplayName
    return userDisplayName ? true : false
})


const displayImgSrc = ref('https://picsum.photos/350/165?random') as Ref<string>
const imgFile = ref([]) as Ref<File[]>
const maxSize = 0.5e6


const inputImgFile = () => {
    if(imgFile.value.length > 0) {
        const newImgSRC =  URL.createObjectURL(imgFile.value[0])
        displayImgSrc.value = newImgSRC
    }
    console.log('trigger input change')
}


const confirmData = async () => {
    console.log(imgFile.value)
    if(imgFile.value.length === 0 || !newDisplayName.value) {
        alert('請確認資料輸入完整')
        return
    }
    if(imgFile.value[0].name && imgFile.value[0].size <= maxSize) {
        const userInfoFolderPath = useAuthStore().uid
                            + '/'
                            + 'userInfo/'
        const newImagePath = userInfoFolderPath
                            + new Date().toISOString() 
                            + '_' 
                            + imgFile.value[0].name
        
        await deleteAllFolderFiles(userInfoFolderPath)
        const photoURL = await uploadFile({uploadFile: imgFile.value[0], uploadPath: newImagePath})
        await updateUserInfo(newDisplayName.value,photoURL)
        useRouter().replace('/')
    }
}


const fileRules = reactive([
    (files: File[]) =>  !files.some(file => file.size > maxSize) || 
                        '檔案需小於 0.5 MB!'
])

</script>