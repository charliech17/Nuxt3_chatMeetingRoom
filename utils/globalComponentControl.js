import { use_GlobalComponent_Store } from "~~/stores/globalComponentStore"

export const toggleShowLoading = (isShowLoading) => {
    use_GlobalComponent_Store().toggleShowLoading(isShowLoading)
}