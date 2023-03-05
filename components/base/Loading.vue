<template>
    <v-dialog
        v-model="isShowDialog"
        persistent
        class="progressBarStyle"
    >
        <v-progress-circular
            :size="50"
            indeterminate
            color="purple"
        ></v-progress-circular>
    </v-dialog>
</template>

<script setup>
    const isShowDialog = ref(true)
</script>


<style lang="scss" scoped>
    .progressBarStyle{
        :deep(.v-overlay__content) {
            display: flex;
            align-items: center;
        }
    }
</style>