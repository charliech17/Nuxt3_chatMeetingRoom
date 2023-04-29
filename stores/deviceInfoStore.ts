import { defineStore } from 'pinia'

export const use_deviceInfo_Store = defineStore('deviceInfo', {
    state: (): State =>{
        return { 
            deviceViewHeight: null,
            deviceViewWidth: null,
            systemColorChange: false,
        }
    },
    getters: {

    },
    actions: {
        saveDeviceState(saveParameter: saveParameterType, saveValue: number) {
            this[saveParameter] = saveValue
        },
        changeSystemColor() {
            const darkClass =   document.getElementById('mainContent_scrollSection_ID')
            const isDarkClass = darkClass?.classList.contains('lightColor')
            if(darkClass && isDarkClass) {
                this.systemColorChange = false
                darkClass.classList.remove('lightColor')
            } 
            else if(darkClass && !isDarkClass){
                this.systemColorChange = true
                darkClass.classList.add('lightColor')
            }
        }
    },
})

interface State {
    deviceViewHeight: null | number
    deviceViewWidth: null | number
    systemColorChange: boolean
}

type saveParameterType = 'deviceViewHeight'| 'deviceViewWidth'