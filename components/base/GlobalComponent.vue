<template>
    <div>
        <BaseLoading v-if="isShowLoading"/>
    </div>
</template>

<script setup>
import { use_GlobalComponent_Store } from '@/stores/globalComponentStore';

const isShowLoading  = computed(() => {
    return use_GlobalComponent_Store().isShowLoading
})
</script>