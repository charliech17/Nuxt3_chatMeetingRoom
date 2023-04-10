<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator :throttle="0" :height="5" :color="'white'"/>
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