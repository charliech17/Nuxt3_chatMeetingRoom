import type { Ref } from 'vue'
import { use_roomInfo_Store } from '@/stores/roomInfoStore'

// TODO 加上close、disconnected、error事件的處理
export const initPeerSettings = ({peer}: initSettingsType ) => {
    // @ 自己裝置連接上peer
    return new Promise(
        (resolve) => { 
            peer.on('open',()=> {resolve('')})
        }
    )
}


export const listenPeerEvent = ({peer,dataReciveCallBack, onConnectionCallBack,localStream, isConnectAudioRef}:listenPeerType) => {
    // @ 別的裝置連接上
    peer.on("connection", (conn:any) => {
        console.log('connection!!!!')
        conn.on("data", (data: dataTransferType) => {
            baseOnDataRecieveFunction(data)

            if(dataReciveCallBack) {
                dataReciveCallBack()
            }
        });
        conn.on("open", () => {
            if(onConnectionCallBack) {
                onConnectionCallBack()
            }
        });
    });

    //  @ 別的裝置call
    peer.on("call", (call: any) => {
        baseOnCallFunction(call,localStream,isConnectAudioRef,peer)
        // }
    })

    //  @ 自己裝置關閉peer連線
    peer.on('close', function() { 
        console.log('close')
    });
    
    //  @ 自己裝置斷線
    peer.on('disconnected', function() { 
        console.log('disconnected')
    })

    //  @ 發生錯誤
    peer.on('error',(error: any)=> {
        console.log('connection error',error,error.type)
    })
}

const videoIDList: string[] = []
export const baseOnCallFunction = (call: any, localStream: MediaStream | undefined, isConnectAudioRef: Ref<boolean>, peer: any) => {
    call.answer(localStream);
    call.on("stream", (remoteStream: MediaStream) => {
        addVideoStream({remoteStream,videoIDList,call,isConnectAudioRef})
        sendVideoOpenStatus(peer,call)
    })
}

export const addVideoStream = (
    {remoteStream,videoIDList,call,isConnectAudioRef} :addVideoStreamType
    ) => {
        console.log('remoteStream.id',call)
        const hasStream = videoIDList.find((id)=> id === call.peer)
        if(hasStream) return

        videoIDList.push(call.peer)
        const newWrapperDiv = document.createElement("div");
        newWrapperDiv.classList.add('position-relative')
        newWrapperDiv.id = call.peer
        
        const newVideo = document.createElement("video");
        newVideo.setAttribute('autoplay','')
        newVideo.setAttribute('playsinline','')
        if(!isConnectAudioRef.value) {
            newVideo.setAttribute('muted','')
        }
        newVideo.srcObject = remoteStream

        const newVideoBackground = document.createElement("img");
        // const imageUrl = new URL('~/assets/image/mediaControls/laughFace.avif', import.meta.url).href
        // TODO 將對方背景URL換成固定圖片(別人頭像，或預設圖片)
        newVideoBackground.src = 'https://source.unsplash.com/random/1920x1081'
        newVideoBackground.classList.add('position-absolute')
        newVideoBackground.style.top = '50%'
        newVideoBackground.style.left = '0'
        newVideoBackground.style.transform = 'translateY(-50%)'
        newVideoBackground.style.display = 'none'

        newWrapperDiv.appendChild(newVideo)
        newWrapperDiv.appendChild(newVideoBackground)

        const insertElement = document.getElementById('insertVideo')
        insertElement?.appendChild(newWrapperDiv)
}


const baseOnDataRecieveFunction = (data: dataTransferType) => {
    const selectVideoImg = document.getElementById(data.peerID)?.querySelector('img') as HTMLImageElement
    console.log(selectVideoImg,data)
    if(selectVideoImg) {
        selectVideoImg.style.display = data.videoOpen ? 'none' : 'block'
    }
}


const sendVideoOpenStatus = (peer: any,call: any) => {
    const conn = peer.connect(call.peer)
    conn.on('open',()=> {
        conn.send({
            peerID: peer.id,
            videoOpen: use_roomInfo_Store().isVideoOpen
        })
    })
}
//  ################## type ##################  //

type dataTransferType = {
    peerID: string, 
    videoOpen: boolean
}

interface initSettingsType {
    peer: any, 
}

interface listenPeerType {
    peer: any, 
    localStream:MediaStream | undefined,
    dataReciveCallBack?: Function, 
    onConnectionCallBack?:Function,
    onCallCallBack?:Function,
    isConnectAudioRef: Ref<boolean>,
}

interface addVideoStreamType {
    remoteStream: MediaStream,
    videoIDList: string[],
    call: any,
    isConnectAudioRef: Ref<boolean>,
}