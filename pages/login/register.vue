<template>
    <div>
        <v-text-field
            :rules="emailRules('register')"
            type="email"
            placeholder="範例: xxx@example.com"
            color="success"
            clearable
            label="註冊帳號"
            class="inputField"
            @update:model-value="(inputTxt)=> handleAccountInput(inputTxt)"
        ></v-text-field>
        <v-text-field
            :rules="passwordValid('register')"
            type="password"
            clearable
            label="輸入密碼"
            maxlength="20"
            class="inputField"
            @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
        ></v-text-field>
        <v-text-field
            :rules="passwordValid('register')"
            type="password"
            clearable
            label="確認密碼"
            maxlength="20"
            class="inputField"
            @update:model-value="(inputTxt)=> handlePasswordInput(inputTxt)"
        ></v-text-field>
        <div>
            <v-btn class="w-100 mt-4" prepend-icon="mdi-account-circle">開始註冊</v-btn>
            <v-btn class="w-100 mt-4" prepend-icon="mdi-account-multiple-plus-outline">前往登入</v-btn>
        </div>
    </div>
</template>


<script lang="ts" setup>
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