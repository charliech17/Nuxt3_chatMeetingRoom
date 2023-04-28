<template>
    <div class="inputSectionStyle">
        <div class="text-center text-lg">註冊</div>
        <v-form @update:modelValue="(boolean) => {isValid = !!boolean}">
            <v-text-field
                v-model="emailAccount"
                :rules="emailRules('register')"
                type="email"
                placeholder="範例: xxx@example.com"
                color="success"
                clearable
                label="註冊帳號"
                class="inputField mt-4 mt-md-8"
                @update:model-value="(inputTxt)=> handleAccountInput(inputTxt)"
            ></v-text-field>
            <v-text-field
                v-model="initPassword"
                :rules="passwordValid('register')"
                type="password"
                clearable
                label="輸入密碼"
                maxlength="20"
                class="inputField"
                @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
            ></v-text-field>
            <v-text-field
                v-model="confirmPassword"
                :rules="passwordValid('register')"
                type="password"
                clearable
                label="確認密碼"
                maxlength="20"
                class="inputField"
                @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
            ></v-text-field>
        </v-form>
        <div>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccountMultiplePlusOutline" :disabled="!isValid" @click="handleRegister">開始註冊</v-btn>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccountCircle" @click="navigateTo('/login')">前往登入</v-btn>
        </div>
    </div>
</template>


<script lang="ts" setup>
    import { emailRules, passwordValid} from '@/utils/login/inputValidation'
    import { registorWithMailAndPwd } from '@/utils/firebase/auth'
    import mdiAccountCircle from '~icons/mdi/account-circle'
    import mdiAccountMultiplePlusOutline from '~icons/mdi/account-multiple-plus-outline'

    const emailAccount = ref('')
    const initPassword = ref('')
    const confirmPassword = ref('')
    const isValid = ref(false)

    function handleAccountInput(inputTxt: string) {
    }

    function handlePasswordInput(inputTxt: string) {
    }

    async function handleRegister() {
        if(initPassword.value !== confirmPassword.value) {
            //TODO 新增alert Dialog
            alert('輸入密碼與確認密碼不同')
            return 
        }
        
        await apiService(() => {
            return registorWithMailAndPwd(emailAccount.value,initPassword.value)
                    .then(() => {
                        useRouter().replace('/room')
                    })
        })
    }
</script>


<style lang="scss" scoped>
    .inputSectionStyle{
        max-width: 600px;
        margin: auto;
    }
    .inputField {
        :deep(.v-messages__message) {
            color: red;
        }
    }

    .otpInputField{
        :deep(.v-input__control .v-field__append-inner) {
            padding-top: calc(var(--v-input-padding-top, 20px) / 2)
        }
    }
</style>