<template>
    <v-btn @click="handleGetAuth">getAuthCode</v-btn> 
    <div>
        {{ showErrorMsg }}
    </div>
</template>

<script setup lang="ts">
//@ts-ignore
import jkos from '@jkos/openweb-bridge'
const showErrorMsg = ref('')
const handleGetAuth = () => {
    jkos.getAuthCode({
        clientId :  '123456' ,
        scopes : ['phone', 'email', 'barcode'],
        onSuccess: (authCode: any) => {
            console.log('authCode',authCode)
        },
        onError: (e: any) => {
            console.log(e.error)
            console.log(e.errorMessage)
        },
        onRejectAuth: () => {}
        }, (res: any) => {
            showErrorMsg.value = res.errorMessage
        console.log(res.error)
        console.log(res.errorMessage)
    })
}
</script>