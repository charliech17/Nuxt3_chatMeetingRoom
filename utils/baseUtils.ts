import type { Ref } from 'vue'
import { use_roomInfo_Store } from '@/stores/roomInfoStore'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

export const getUserMedia = (constraints: MediaStreamConstraints):Promise<MediaStream> => {
    return navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
        return stream
    })
    .catch((err) => {
        alert(err)
        throw new Error(err)
        /* handle the error */
    });
}

export const toggleStreamOutput = (
        stream: undefined | MediaStream, 
        inputType: 'video' | 'audio', 
        videoRef: Ref, 
        soundRef: Ref,
        toggle_BG_function: (isVideoOpen: boolean) => void
    ) => 
        {
            if(!stream) return 
            const mediaTrack = stream.getTracks().find(track => track.kind === inputType)
            
            if(mediaTrack?.enabled) {
                mediaTrack.enabled = false
                if(inputType === 'video') {
                    toggle_BG_function(false)
                    videoRef.value = false
                    use_roomInfo_Store().setVideoStaus(false)
                } else {
                    soundRef.value = false
                }
            } else {
                if(!mediaTrack) return
                mediaTrack.enabled = true
                if(inputType === 'video') {
                    toggle_BG_function(true)
                    videoRef.value = true
                    use_roomInfo_Store().setVideoStaus(true)
                } else {
                    soundRef.value = true
                }
            }
    }


export const enumerateAllSource = (allVideoInput: Ref<MediaDeviceInfo[]>, allMicroInput: Ref<MediaDeviceInfo[]>) => {
    if (!navigator.mediaDevices?.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
    } else {
    const saveDeviceList: object[] = []
    // List cameras and microphones.
    return navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                saveDeviceList.push(device)
                if(device.kind === 'videoinput') {
                    allVideoInput.value.push(device)
                }
                if(device.kind === 'audioinput') {
                    allMicroInput.value.push(device)
                }
            });
        })
        .catch((err) => {
            console.error(`${err.name}: ${err.message}`);
        });
    }
}

export const getSHA256Hash = async (input: string) => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(4, "0"))
        .join("")
        .substring(0,16);
    return window.btoa(hash);
};


export const watchLoginStatus = async () => {
    // 確定登入狀態
    const authStore = useAuthStore()
    if(authStore.isAuth === true) return true
    if(authStore.isAuth === false) return false
    // 尚未確定登入狀態(authStore.isAuth 目前為null時執行下面程式)
    const { isAuth } = storeToRefs(authStore)
    return new Promise((resolve) => {
        watch(isAuth,(newAuth) => {
            if(newAuth === false) {
                return resolve(false)
            } else if(newAuth === true) {
                return resolve(true)
            }
        })
    })
}
// ############## type  ############## //