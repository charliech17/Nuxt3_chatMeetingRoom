export const apiService = async (apiFunction: Function) => {
    toggleShowLoading(true)
    const returnValue = await apiFunction().catch(()=>{
        // TODO 將所有error的處理在這邊處理
        toggleShowLoading(false)
        return
    })
    toggleShowLoading(false)
    return returnValue
}