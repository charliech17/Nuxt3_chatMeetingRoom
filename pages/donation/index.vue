<template>
    <div>
        <h1 class="text-center">~~贊助~~</h1>
        <div class="text-center">
            <v-btn class="mt-4" @click="jkosPay">街口支付</v-btn> 
            <v-btn class="mt-4 ml-2" @click="openLinePay">linePay</v-btn> 
        </div>
        <section class="mt-4 d-flex justify-center">
            <div v-if="isShowJkosImg" class="max-w-[50%]">
                <img src="@/assets/image/donation/jkos.png" alt="">
            </div>
            <div v-if="isShowLinePay" class="max-w-[50%]">
                <img src="@/assets/image/donation/linePay.png" alt="">
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { isMobileDevice } from '@/utils/baseUtils'

const isShowJkosImg = ref(false)
const isShowLinePay = ref(false)

const jkosPay = () => {
    const jkosAccont = 'https://www.jkopay.com/transfer?j=Transfer:905309698'
    if(isMobileDevice()) {
        window.open(jkosAccont)
    } 
    isShowJkosImg.value = !isShowJkosImg.value
    isShowLinePay.value = false
}

const openLinePay = () => {
    isShowLinePay.value = !isShowLinePay.value
    isShowJkosImg.value = false
}
</script>