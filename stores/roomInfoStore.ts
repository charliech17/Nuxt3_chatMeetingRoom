import { defineStore } from 'pinia'

export const use_roomInfo_Store = defineStore('roomInfo', {
    state(){
        return { 
            isVideoOpen: false,
        }
    },
    getters: {

    },
    actions: {
        setVideoStaus(newStatus: boolean) {
            this.isVideoOpen = newStatus
        }
    },
})