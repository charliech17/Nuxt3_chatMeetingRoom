<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage/>
    </NuxtLayout>
    <BaseGlobalComponent/>
  </div>
</template>

<script lang="ts" setup>
import { firebaseInit } from '@/utils/firebase/firebaseInit'
import { getUserAuthState } from '@/utils/firebase/auth'

const app  = firebaseInit()
getUserAuthState()
//TODO firbase auth
</script>

<style>
  html{
    color-scheme: dark;
  }
</style>