import { defineStore } from 'pinia'

export const use_deviceInfo_Store = defineStore('deviceInfo', {
    state: (): State =>{
        return { 
            deviceViewHeight: null,
            deviceViewWidth: null,
        }
    },
    getters: {

    },
    actions: {
        saveDeviceState(saveParameter: saveParameterType, saveValue: number) {
            this[saveParameter] = saveValue
        }
    },
})

interface State {
    deviceViewHeight: null | number
    deviceViewWidth: null | number
}

type saveParameterType = 'deviceViewHeight'| 'deviceViewWidth'