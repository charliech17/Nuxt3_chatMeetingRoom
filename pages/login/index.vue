<template>
    <div>
        <v-text-field
            v-model="inputEmail"
            :rules="emailRules('login')"
            type="email"
            placeholder="範例: xxx@example.com"
            color="success"
            clearable
            label="帳號"
            class="inputField"
            @update:model-value="(inputTxt)=> handleAccountInput(inputTxt)"
        ></v-text-field>
        <v-text-field
            v-model="inputOTP"
            type="number"
            clearable
            label="OTP驗證碼"
            class="inputField otpInputField"
        >
            <template #append-inner>
                <v-btn variant="tonal">發送驗證碼</v-btn>
            </template>
        </v-text-field>
        <v-text-field
            v-model="inputPassword"
            :rules="passwordValid('login')"
            type="password"
            clearable
            label="密碼"
            maxlength="20"
            class="inputField"
            @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
        ></v-text-field>
        <div>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccount" @click="loginUser">登入</v-btn>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccountMultiplePlusOutline" @click="$router.push('/login/register')">註冊</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { emailRules, passwordValid} from '@/utils/login/inputValidation'
    import { loginWithMailAndPwd } from '@/utils/firebase/auth'
    import { useAuthStore } from '@/stores/authStore'
    import mdiAccount from '~icons/mdi/account'
    import mdiAccountMultiplePlusOutline from '~icons/mdi/account-multiple-plus-outline'

    const inputEmail = ref('')
    const inputPassword = ref('')
    const inputOTP = ref('')

    function handleAccountInput(inputTxt: string) {}

    function handlePasswordInput(inputTxt: string) {}

    async function loginUser() {
        if(inputOTP.value !== '123456') {
            // TODO　實作OTP
            alert('OTP 輸入錯誤')
            return
        }

        const router = useRouter()
        await apiService(() => loginWithMailAndPwd(
                inputEmail.value,
                inputPassword.value,
                ()=> {
                    if(!useAuthStore().displayName) return router.push('/userInfo')
                    return router.push('/room')
                }
            ))
    }

</script>

<style lang="scss" scoped>
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