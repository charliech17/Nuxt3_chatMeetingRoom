// TODO 加上close、disconnected、error事件的處理
export const initPeerSettings = ({peer, onOpenCallBack}: initSettingsType ) => {
    // @ 自己裝置連接上peer
    peer.on('open',()=> {
        console.log('open!!!!',peer)
        if(onOpenCallBack) {
            onOpenCallBack()
        }
    })
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
let videoCurTimeList: number[] = []
let kickoutCount: number[] = []
let checkInterval: number | undefined = undefined
export const baseOnCallFunction = (call: any, localStream: MediaStream | undefined) => {
    call.answer(localStream);
    call.on("stream", (remoteStream: MediaStream) => {
        addVideoStream({remoteStream,videoIDList,videoCurTimeList,kickoutCount,checkInterval})
    })
}

export const addVideoStream = (
    {remoteStream,videoIDList,videoCurTimeList,kickoutCount,checkInterval} :addVideoStreamType
    ) => {
        const hasStream = videoIDList.find((id)=> id === remoteStream.id)
        if(hasStream) return

        videoIDList.push(remoteStream.id)
        const newVideo = document.createElement("video");
        newVideo.setAttribute('autoplay','')
        newVideo.setAttribute('muted','')
        newVideo.setAttribute('playsinline','')
        newVideo.srcObject = remoteStream
        newVideo.id = remoteStream.id
        videoCurTimeList[videoCurTimeList.length] = 0
        kickoutCount[kickoutCount.length] = 0

        const insertElement = document.getElementById('insertVideo')
        insertElement?.appendChild(newVideo)

        checkIsUserLeave(videoIDList,videoCurTimeList,kickoutCount,checkInterval)
}


export const checkIsUserLeave = (videoIDList: string[],videoCurTimeList:number[],kickoutCount:number[],checkInterval:number | undefined) => {
    clearInterval(checkInterval)
    checkInterval = window.setInterval(() => {
        // TODO 拿掉console
        console.log(checkInterval)
        videoIDList.forEach((id,index)=> {
            const video = document.getElementById(id) as HTMLVideoElement
            if(video) {
                // TODO 拿掉console
                console.log('video time',video.currentTime,videoCurTimeList[index],video.currentTime == videoCurTimeList[index],video.currentTime === videoCurTimeList[index])
                if(video.currentTime == videoCurTimeList[index]) {
                    kickoutCount[index] += 1
                    if(kickoutCount[index] > 5) {
                        // TODO kickout user
                        console.log('kickout user')
                        kickoutUser(index,video,videoIDList,videoCurTimeList,kickoutCount)
                        return
                    }
                } else {
                    videoCurTimeList[index] = video.currentTime
                }
            }
        })
    },1500)
}

export const kickoutUser = (index:number,video: HTMLVideoElement,videoIDList: string[],videoCurTimeList:number[],kickoutCount:number[]) => {
    videoIDList.splice(index,1)
    videoCurTimeList.splice(index,1)
    kickoutCount.splice(index,1)
    video.remove()
}

//  ################## type ##################  //

interface initSettingsType {
    peer: any, 
    onOpenCallBack?: Function, 
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
    videoCurTimeList:number[],
    kickoutCount:number[],
    checkInterval: number | undefined,
}