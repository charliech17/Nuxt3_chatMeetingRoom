import { use_GlobalComponent_Store } from "~~/stores/globalComponentStore"

export const toggleShowLoading = (isShowLoading: boolean) => {
    use_GlobalComponent_Store().toggleShowLoading(isShowLoading)
}

const endScrolling = (isStart: boolean) => {
    const scrollSection = document.getElementById('mainContent_scrollSection_ID')
    if(isStart && scrollSection) {
        scrollSection.style.overflow = 'hidden'
    }
    else if(!isStart &&  scrollSection) {
        scrollSection.style.overflow = ''
    }
}

export const disableScroll = (isDisable: boolean) => {
    const scrollSection = document.getElementById('mainContent_scrollSection_ID')
    if(isDisable && scrollSection) {
        scrollSection.style.overflow = 'hidden'
    }
    else if(!isDisable &&  scrollSection) {
        scrollSection.style.overflow = ''
    }
}

export const pageChangeLoadingIndicater =  () => {
    useRouter().beforeEach(()=> {
        toggleShowLoading(true)
        endScrolling(true)
    })

    useRouter().afterEach(()=> {
        toggleShowLoading(true)
        nextTick(()=> {
            console.log('stop!!!')
            toggleShowLoading(false)
            endScrolling(false)
        })
    })
}