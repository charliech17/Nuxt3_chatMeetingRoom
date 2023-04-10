import { use_GlobalComponent_Store } from "~~/stores/globalComponentStore"

export const toggleShowLoading = (isShowLoading: boolean) => {
    use_GlobalComponent_Store().toggleShowLoading(isShowLoading)
}

export const pageChangeLoadingIndicater =  () => {
    useRouter().beforeEach(()=> {
        toggleShowLoading(true)
    })

    useRouter().afterEach(()=> {
        toggleShowLoading(true)
        nextTick(()=> {
            console.log('stop!!!')
            toggleShowLoading(false)
        })
    })
}