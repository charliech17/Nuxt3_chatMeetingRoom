import type { Ref } from 'vue'

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

export const toggleStreamOutput = (stream: undefined | MediaStream, inputType: 'video' | 'audio', videoRef: Ref, soundRef: Ref) => {
    if(!stream) return 
    const videoTrack = stream.getTracks().find(track => track.kind === inputType)
    console.log('vdTrack',videoTrack,stream)
    
    if(videoTrack?.enabled) {
        videoTrack.enabled = false
        console.log(videoTrack,videoTrack.enabled)
        inputType === 'video' ? videoRef.value = false : soundRef.value = false
    } else {
        if(!videoTrack) return
        videoTrack.enabled = true
        inputType === 'video' ? videoRef.value = true : soundRef.value = true
    }
  }


// ############## type  ############## //

interface mediaConstraintsType {
    audio: boolean
    video: boolean | { facingMode : string | object }
}