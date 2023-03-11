export const apiService = async (apiFunction: Function) => {
    toggleShowLoading(true)
    await apiFunction().catch(()=>toggleShowLoading(false))
    toggleShowLoading(false)
}