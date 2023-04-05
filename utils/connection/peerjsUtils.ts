import type { Ref } from 'vue'
import { use_roomInfo_Store } from '@/stores/roomInfoStore'
import InsertNewVideo from '@/components/room/insertNewVideo.vue'
import { defineComponent, createApp, defineProps } from 'vue'

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
        const insertVideoSection = defineComponent({ 
            extends: InsertNewVideo,
            template:`<template><InsertNewVideo/></template>`,
            setup(){
                onMounted(()=> {
                    const newVideo = document.getElementById(call.peer)?.querySelector('video') as HTMLVideoElement
                    newVideo.srcObject = remoteStream
                    if(!isConnectAudioRef.value) {
                        newVideo.setAttribute('muted','')
                        newVideo.muted = true
                    }
                })
            }
        })

        const wrapperDiv = document.createElement('div')
        wrapperDiv.classList.add('position-relative')
        wrapperDiv.id = call.peer

        const insertElement = document.getElementById('insertVideo') as Element
        insertElement?.appendChild(wrapperDiv)
        createApp(insertVideoSection).mount(wrapperDiv)
}


const baseOnDataRecieveFunction = (data: dataTransferType) => {
    const selectVideoImg = document.getElementById(data.peerID)?.querySelector('.bg_wrapper_div') as HTMLDivElement
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