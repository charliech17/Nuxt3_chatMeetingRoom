import { defineStore } from 'pinia'

export const use_GlobalComponent_Store = defineStore('globalComponent', {
    state(){
        return { 
            isShowLoading: false,
        }
    },
    getters: {

    },
    actions: {
        toggleShowLoading(boolean) {
            this.isShowLoading = boolean
        }
    },
})