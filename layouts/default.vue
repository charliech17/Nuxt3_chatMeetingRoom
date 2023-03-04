<template>
    <LayoutHeader/>
    <main class="mainContentStyle">
        <slot></slot>
    </main>
</template>

<style lang="scss" scoped>
    .mainContentStyle{
        padding: 16px;
    }
</style>