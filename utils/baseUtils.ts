
export const getUserMedia = (constraints: mediaConstraintsType, callBack: Function):Promise<any> => {
    return navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
        callBack(stream)
    })
    .catch((err) => {
        alert(err)
        throw new Error(err)
        /* handle the error */
    });
}


// ############## type  ############## //

interface mediaConstraintsType {
    audio: boolean
    video: boolean | { facingMode : string | object }
}