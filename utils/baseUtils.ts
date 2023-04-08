import type { Ref } from 'vue'
import { use_roomInfo_Store } from '@/stores/roomInfoStore'

export const getUserMedia = (constraints: mediaConstraintsType):Promise<MediaStream> => {
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


// ############## type  ############## //

interface mediaConstraintsType {
    audio: boolean | {deviceId: { exact: string }}
    video: boolean | { facingMode : string | object } | {deviceId: { exact: string }}
}