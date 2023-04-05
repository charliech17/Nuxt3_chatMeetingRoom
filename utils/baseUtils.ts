import type { Ref } from 'vue'
import { use_roomInfo_Store } from '@/stores/roomInfoStore'

export const getUserMedia = (constraints: mediaConstraintsType):Promise<any> => {
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


export const enumerateAllSource = () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
        console.log("enumerateDevices() not supported.");
    } else {
    // List cameras and microphones.
    navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
        devices.forEach((device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
        })
        .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
        });
    }
}


// ############## type  ############## //

interface mediaConstraintsType {
    audio: boolean
    video: boolean | { facingMode : string | object }
}