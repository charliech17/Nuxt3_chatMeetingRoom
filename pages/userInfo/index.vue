<template>
    <div class="userInfo_style">
        <div class="text-lg text-center">{{hasDisplayName ? '更新' :'設定' }}個人資料</div>
        <v-text-field 
            class="displayNameStyle mt-4 mt-md-8"
            :rules="[(inputName)=> !inputName.value || '尚未輸入名稱']"
            v-model="newDisplayName"
            label="顯示名稱"
            :prepend-icon="mdiAccount"
        />
        <v-file-input
            class="fileInputStyle"
            :rules="fileRules"
            v-model="imgFile"
            @change="inputImgFile"
            :prepend-icon="mdiCamera"
            accept="image/*"
            clearable
            show-size
            counter
            label="File input"
        />
        <div class="mt-md-8">
            <div>
                {{hasDisplayName ? '目前的圖片:' : '上傳圖片後顯示在下方框格內'}}
            </div>
            <v-img
                max-height="150px"
                :src="displayImgSrc"
                width="100%"
                class="bg-grey-lighten-2 mt-4"
            ></v-img>
        </div>
        <v-btn
        class="mt-4"
            block
            :prepend-icon="mdiCheckOutline" 
            variant="tonal"
            @click="confirmData"
        >
            <template v-slot:prepend>
                <v-icon :color="'green'"/>
            </template>
            確認資訊
        </v-btn>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore'
import { uploadFile, deleteAllFolderFiles } from '@/utils/firebase/useStorage'
import { updateUserInfo } from '@/utils/firebase/auth'
import { storeToRefs } from 'pinia'
import mdiAccount from '~icons/mdi/account'
import mdiCamera  from '~icons/mdi/camera'
import mdiCheckOutline from '~icons/mdi/check-outline'

const { photoURL } = storeToRefs(useAuthStore())
const displayImgSrc = ref('https://picsum.photos/350/165?random') as Ref<string>
if(photoURL.value) {
    displayImgSrc.value = photoURL.value 
} else {
    watch(photoURL, () => {
        if(photoURL.value) {
            displayImgSrc.value = photoURL.value
        }
    })
}

const newDisplayName = ref('') as Ref<string | null>
const hasDisplayName = computed(() => {
    const userDisplayName = useAuthStore().displayName
    newDisplayName.value = userDisplayName
    return userDisplayName ? true : false
})


const imgFile = ref([]) as Ref<File[]>
const maxSize = 3e6


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

<style lang="scss" scoped>
    .userInfo_style {
        max-width: 600px;
        margin: auto;
    }

    .displayNameStyle,
    .fileInputStyle{
        :deep(.v-input__prepend){
            color: rgb(205, 126, 205);
        }
    }
</style>