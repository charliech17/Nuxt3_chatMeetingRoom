// TODO 加上close、disconnected、error事件的處理
export const initPeerSettings = ({peer}: initSettingsType ) => {
    // @ 自己裝置連接上peer
    return new Promise(
        (resolve) => { 
            peer.on('open',()=> {resolve('')})
        }
    )
}


export const listenPeerEvent = ({peer,dataReciveCallBack, onConnectionCallBack, onCallCallBack,localStream}:listenPeerType) => {
    // @ 別的裝置連接上
    peer.on("connection", (conn:any) => {
        console.log('connection!!!!')
        conn.on("data", (data: string) => {
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
        // if(onCallCallBack) {
            baseOnCallFunction(call,localStream)
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
export const baseOnCallFunction = (call: any, localStream: MediaStream | undefined) => {
    call.answer(localStream);
    call.on("stream", (remoteStream: MediaStream) => {
        addVideoStream({remoteStream,videoIDList,call})
    })
}

export const addVideoStream = (
    {remoteStream,videoIDList,call} :addVideoStreamType
    ) => {
        console.log('remoteStream.id')
        const hasStream = videoIDList.find((id)=> id === call.peer)
        if(hasStream) return

        videoIDList.push(call.peer)
        const newVideo = document.createElement("video");
        newVideo.setAttribute('autoplay','')
        newVideo.setAttribute('muted','')
        newVideo.setAttribute('playsinline','')
        newVideo.srcObject = remoteStream
        newVideo.id = call.peer

        const insertElement = document.getElementById('insertVideo')
        insertElement?.appendChild(newVideo)
}

//  ################## type ##################  //

interface initSettingsType {
    peer: any, 
}

interface listenPeerType {
    peer: any, 
    localStream:MediaStream | undefined,
    dataReciveCallBack?: Function, 
    onConnectionCallBack?:Function,
    onCallCallBack?:Function,
}

interface addVideoStreamType {
    remoteStream: MediaStream,
    videoIDList: string[],
    call: any,
}