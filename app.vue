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
import { pageChangeLoadingIndicater } from '@/utils/globalComponentControl'

const app  = firebaseInit()
getUserAuthState()

pageChangeLoadingIndicater()

</script>

<style>
  html{
    color-scheme: dark;
  }
</style>