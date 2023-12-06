<template>
    <div class="inputSectionStyle">
        <div class="text-center text-lg">登入</div>
        <v-text-field
            v-model="inputEmail"
            :rules="emailRules('login')"
            type="email"
            placeholder="範例: xxx@example.com"
            color="success"
            clearable
            label="帳號"
            class="inputField mt-4 mt-md-8"
            @update:model-value="(inputTxt: string)=> handleAccountInput(inputTxt)"
        ></v-text-field>
        <v-text-field
            v-model="inputOTP"
            type="number"
            clearable
            label="OTP驗證碼"
            class="inputField otpInputField"
        >
            <template #append-inner>
                <v-btn variant="tonal" @click="getOTP">發送驗證碼</v-btn>
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
            @update:model-value="(inputTxt: string)=> handlePasswordInput(inputTxt)"
        ></v-text-field>
        <div>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccountCircle" @click="loginUser">登入</v-btn>
            <v-btn class="w-100 mt-4" :prepend-icon="mdiAccountMultiplePlusOutline" @click="navigateTo('/login/register')">註冊</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { emailRules, passwordValid} from '@/utils/login/inputValidation'
    import { loginWithMailAndPwd } from '@/utils/firebase/auth'
    import { useAuthStore } from '@/stores/authStore'
    import mdiAccountCircle from '~icons/mdi/account-circle'
    import mdiAccountMultiplePlusOutline from '~icons/mdi/account-multiple-plus-outline'
    import { apiRes } from "@/assets/js/apiRes"

    const inputEmail = ref('')
    const inputPassword = ref('')
    const inputOTP = ref('')

    function handleAccountInput(inputTxt: string) {}

    function handlePasswordInput(inputTxt: string) {}

    
    async function getOTP() {
        if(!inputEmail.value) {
            alert('請先輸入帳號')
            return
        }
        const isGoogle = inputEmail.value.match(/@gmail.com/)
        if(!isGoogle) {
            alert('目前只能使用gmail發送otp')
            return
        }
        
        const nowDate = new Date()
        const hasSaveTime = localStorage["canNextOTP"]
        const limitTime = nowDate.getTime() + Number(120 * 1000)
        const canNextOTP = localStorage["canNextOTP"] 
                            || limitTime
        if(hasSaveTime && nowDate < canNextOTP) {
            alert("發送otp間隔需要大於兩分鐘")
            return
        } else {
            localStorage["canNextOTP"] = limitTime

            const fetchUrl = (import.meta.env.VITE_BACKEND_URL as string)! + (import.meta.env.VITE_OTP_GET_PATH as string)!
            const reqBody = {
                uid: inputEmail.value
            }
            await apiService(async () => {
                return fetch(fetchUrl,{
                    method: "POST",
                    headers: {"Content-Type": "application/json", "Authorization":""},
                    body: JSON.stringify(reqBody)
                }).then((res)=> {
                    return res.json()
                }).then((data)=> {
                    const pdata = data
                    console.log(pdata)
                    alert(pdata.note)
                })
            })
        }

    }

    async function loginUser() {
        // 確認有否欄位是空值
        const isInputEmpty = !inputEmail.value || !inputPassword.value || !inputOTP.value
        if( isInputEmpty) {
            alert("登入欄位有空值")
            return
        }
        // 確認otp是否正確 
        let resJSON;
        await apiService(async ()=> {
            const fetchUrl = (import.meta.env.VITE_BACKEND_URL as string)! + (import.meta.env.VITE_OTP_CONFIRM_PATH as string)!
            const reqBody = {
                uid: inputEmail.value,
                userOTP: inputOTP.value
            }
            resJSON = await fetch(fetchUrl,{
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization":""},
                body: JSON.stringify(reqBody)
            }).then(res => res.json())
            
        })
        if(!(resJSON!.code === apiRes.success)) {
            if(resJSON!.code === apiRes.otpfail) {
                alert("請輸入正確的otp")
            } else {
                alert(`${resJSON!.code} ${resJSON!.note}`)
            }
            return 
        }
        // 登入
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