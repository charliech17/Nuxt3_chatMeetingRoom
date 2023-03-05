<template>
    <div>
        <p>{{ '是否連線' + isConnected ? '是' : '否' }}</p>
        <p>{{ '連接ID :' + connectID }}</p>
    </div>
    <div>
        <video 
            id="my_liveStreamvideo" 
            muted 
            autoplay 
            playsinline
        />
        <video 
            id="stream_liveStreamvideo" 
            muted 
            autoplay 
            playsinline
        />
    </div>
</template>

<script lang="ts" setup>
import { io } from "socket.io-client";
  // import { Peer } from "peerjs";

  // ========================= web socket部分  ========================= //
  /** 
   * 處理peer 連線
  */

  const isConnected = ref(false)
  const connectID   = ref('')
  const socketMessage = ref('')
  const socket = reactive(io("http://localhost:3000"));
  const otherVdSrc = ref('')

    // server-side
    socket.on("connection", (socket) => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    // client-side
    socket.on("connect", () => {
        isConnected.value = true
        connectID.value = socket.id
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("disconnect", () => {
        isConnected.value = false
        connectID.value = socket.id
        console.log(socket.id); // undefined
    });

    const emitWebSocket = () => {
        socket.emit('hello',{name:'Josh',age:18})
    }

    socket.on('asd',(message)=>{
        socketMessage.value = message 
    })

    socket.on('stream_server_data',(data:any)=>{
        const video = document.querySelector('#stream_liveStreamvideo') as HTMLVideoElement;
        // const videoSource = document.querySelector('#stream_liveStreamSource') as HTMLSourceElement;
        // console.log(data)
        if(video) {
        console.log(new Blob([data], { type: mediaMimeType }))
            video.src = URL.createObjectURL(new Blob([data], { type: mediaMimeType }))
            video.onloadedmetadata = () => {
            video.play();
            }
        // console.log(event.data)
        }
        // console.log(data)
    })
  
//   // ========================= 影像live Streaming 部分  ========================= //
//   /** 
//    * 處理自己的streaming
//   */
    let mediaStreamRecord: any = null 
    let mediaMimeType: string | undefined = undefined

    const startStreaming = (socket: any) => {
        const constraints = {
        audio: true,
        video: {  facingMode: "user" }
        };

        navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
        const video = document.querySelector('#my_liveStreamvideo') as HTMLVideoElement;
        if(video) {
            video.srcObject = mediaStream;
            video.onloadedmetadata = () => {
            video.play();
            }
            
            mediaStreamRecord = new MediaRecorder(mediaStream)
            mediaStreamRecord.start(1000)
            mediaStreamRecord.ondataavailable = (event: any) => {
            // const video = document.querySelector('#stream_liveStreamvideo') as HTMLVideoElement;
            // if(video) {
            //     mediaMimeType = mediaStreamRecord.mimeType
            //     console.log(mediaMimeType)
            //     video.src = URL.createObjectURL(new Blob([event.data],{type: mediaMimeType}));
            //     video.onloadedmetadata = () => {
            //         video.currentTime = 10000
            //         video.play();
            //     }
            //   // console.log(event.data)
            // }
            console.log(event.data)
            socket.emit('start_streaming',event.data)
            }
        };
        
        })
        .catch((err) => {
        // always check for errors at the end.
        console.error(`${err.name}: ${err.message}`);
        });
    }

    const blobToDataURL = (blob:any, callback: Function) => {
        var a = new FileReader();
        a.onload = function(e) {
        if(e.target){
            callback(e.target.result);
        }
        }
        a.readAsDataURL(new Blob([blob]));
    }

    startStreaming(socket)
</script>