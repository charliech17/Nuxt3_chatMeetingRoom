export const apiService = async (apiFunction: Function) => {
    toggleShowLoading(true)
    const returnValue = await apiFunction().catch((error: Error)=>{
        alert('發生錯誤，程式可能無法正常執行，建議重新整理。錯誤訊息: '+ error)
        // TODO 將所有error的處理在這邊處理
        toggleShowLoading(false)
        return
    })
    toggleShowLoading(false)
    return returnValue
}