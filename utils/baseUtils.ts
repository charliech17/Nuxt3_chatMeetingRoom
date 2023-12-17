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

export const checkNeedReloadPage = () => {
    useRouter().afterEach((to,from)=> {
        if(from.path.includes('room/') && !to.path.includes('room/')) {
            location.reload()
        } 
    })
}

export const isMobileDevice = () => {
    let check = false;
    (function(a){
        if(
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))
        ) check = true;
    })(navigator.userAgent);
    return check;
}

export const calHeaderHeight = () => {
    const headerElement = document.getElementsByClassName('headerSection')[0]
    const headerHeight = window.getComputedStyle(headerElement,null).height
    return Number(headerHeight.replace("px",""))
}

export async function smoothScroll(targetHeight:number,scorllElId:string,moveFactor:number=5,direct: "x"| "y" = "y",moveInfo:{endScroll: boolean,isMoving: boolean}= {endScroll: false,isMoving: true}) {
    return new Promise(resolve => {
        if(moveFactor > 5 || moveFactor <= 0) {
            throw new Error("moveFactor在1~5之間")
        }
        const scrollElement = document.getElementById(scorllElId)
        if(!scrollElement) return
    
        let curPos = direct === "y" ?  scrollElement.scrollTop : scrollElement.scrollLeft
        let start: null|number = null
        let pos = targetHeight
        let time = Math.abs(targetHeight - curPos) / moveFactor
        let raf:ReturnType<typeof requestAnimationFrame>
    
        moveInfo.isMoving = true
        raf = window.requestAnimationFrame(function step(curTime) {
            if(moveInfo.endScroll) {
                moveInfo.endScroll = false
                moveInfo.isMoving = false
                cancelAnimationFrame(raf)
                return
            }
            start = !start ? curTime : start
            let progress = curTime - start
    
            if(direct === "y") {
                if(curTime < pos) {
                    scrollElement.scrollTo(0,((pos-curPos)*progress / time)+curPos)
                } else {
                    scrollElement.scrollTo(0,curPos - ((curPos - pos)*progress / time))
                }
            } else {
                if(curTime < pos) {
                    scrollElement.scrollTo(((pos-curPos)*progress / time)+curPos,0)
                } else {
                    scrollElement.scrollTo(curPos - ((curPos - pos)*progress / time),0)
                }
            }
    
            if(progress < time) {
                window.requestAnimationFrame(step)
            } else {
                if(direct === "y") {
                    scrollElement.scrollTo(0,pos)
                } else {
                    scrollElement.scrollTo(pos,0)
                }
                moveInfo.isMoving = false
                resolve('')
            }
        })
    })
}

export function getScrollPosition() {
    const scrollSection = document.getElementById('mainContent_scrollSection_ID')
    return scrollSection!.scrollTop
}
// ############## type  ############## //