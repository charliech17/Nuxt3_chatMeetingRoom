<template>
    <LayoutHeader/>
    <main class="mainContentStyle" id="mainContent_scrollSection_ID">
        <slot></slot>
    </main>
</template>

<script lang="ts" setup>
    import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'

    const getWindowSize = () => {
        const windowHeight = window.innerHeight
        const windowWidth  = window.innerWidth
        document.documentElement.style.setProperty('--vh',  `${windowHeight * 0.01}px`)
        use_deviceInfo_Store().deviceViewHeight = windowHeight
        use_deviceInfo_Store().deviceViewWidth  = windowWidth

        nextTick(()=> {
            const headerElement = document.getElementsByClassName('headerSection')[0]
            const headerHeight = window.getComputedStyle(headerElement,null).height
            document.documentElement.style.setProperty('--headerHeight',  headerHeight)
        })
    }
    
    getWindowSize()
    window.addEventListener('resize',()=> {
        getWindowSize()
    })
    
</script>

<style lang="scss" scoped>
    .mainContentStyle{
        padding: 16px;
        height: calc(var(--vh,1vh)* 100 - var(--headerHeight));
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>