import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth',{
    state(){
        return { 
            isAuth: false,
            uid: null,
            email: null,
            displayName: null,
        }
    },
    getters: {

    },
    actions: {
        toggleAuthState(boolean) {
            this.isAuth = boolean
        },
        updateLoginInfo(userInfoObj) {
            this.uid   = userInfoObj.uid
            this.email = userInfoObj.email
            this.displayName = userInfoObj.displayName
        }
    },
})