export const apiService = async (apiFunction: Function) => {
    toggleShowLoading(true)
    await apiFunction()
    toggleShowLoading(false)
}