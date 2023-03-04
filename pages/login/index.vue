<template>
    <div>
        <v-text-field
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
            :rules="passwordValid('login')"
            type="password"
            clearable
            label="密碼"
            maxlength="20"
            class="inputField"
            @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
        ></v-text-field>
        <div>
            <v-btn class="w-100 mt-4" prepend-icon="mdi-account-circle">登入</v-btn>
            <v-btn class="w-100 mt-4" prepend-icon="mdi-account-multiple-plus-outline">註冊</v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { emailRules, passwordValid} from '@/utils/login/inputValidation'

    function handleAccountInput(inputTxt: string) {
    }

    function handlePasswordInput(inputTxt: string) {
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