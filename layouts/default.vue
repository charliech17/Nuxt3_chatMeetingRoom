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

        const mb_size = 768
        use_deviceInfo_Store().isMobile = windowWidth  > mb_size ? false : true

        nextTick(()=> {
            const headerHeight = calHeaderHeight()
            document.documentElement.style.setProperty('--headerHeight',  headerHeight)
            document.getElementsByTagName("html")[0].style.overflow = "hidden"
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
        background-color: #f0f9fd82;
    }
</style>