<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
  <!-- <div>
    <p>是否連結? {{ isConnected ? '是' : '否'}}</p>
    <p>id {{ connectID }}</p>
    <button @click="emitWebSocket">emit事件</button>
    <p>{{socketMessage}}</p>
    <button @click="()=> startStreaming(socket)">開始串流</button>
    <video  
      id="my_liveStreamvideo"
      muted
      autoplay
      playsinline
    ></video>
    <video  
      id="stream_liveStreamvideo"
      muted
      autoplay
      playsinline
    >
      <source id="stream_liveStreamSource" src="" type="video/mkv">
    </video>
  </div> -->
</template>

<script lang="ts" setup>
import { useDark,useToggle } from '@vueuse/core'
const isDark = useDark()
useToggle(isDark);
  // import { io } from "socket.io-client";
  // import { Peer } from "peerjs";

  // ========================= web socket部分  ========================= //
  /** 
   * 處理peer 連線
  */

//   const isConnected = ref(false)
//   const connectID   = ref('')
//   const socketMessage = ref('')
//   const socket = reactive(io("http://localhost:3000"));
//   const otherVdSrc = ref('')

//   // server-side
//   socket.on("connection", (socket) => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });

//   // client-side
//   socket.on("connect", () => {
//     isConnected.value = true
//     connectID.value = socket.id
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
//   });

//   socket.on("disconnect", () => {
//     isConnected.value = false
//     connectID.value = socket.id
//     console.log(socket.id); // undefined
//   });

//   const emitWebSocket = () => {
//     socket.emit('hello',{name:'Josh',age:18})
//   }

//   socket.on('asd',(message)=>{
//     socketMessage.value = message 
//   })

//   socket.on('stream_server_data',(data:any)=>{
//     const video = document.querySelector('#stream_liveStreamvideo') as HTMLVideoElement;
//     const videoSource = document.querySelector('#stream_liveStreamSource') as HTMLSourceElement;
//     // console.log(data)
//     if(video) {
//       console.log(new Blob([data], { type: "video/x-matroska;codecs=avc1,opus" }))
//       //@ts-ignore
//         videoSource.src = URL.createObjectURL(new Blob([data], { type: "video/x-matroska;codecs=avc1,opus" }));
//         videoSource.onloadedmetadata = () => {
//           video.play();
//         }
//       // console.log(event.data)
//     }
//     // console.log(data)
//   })
  
//   // ========================= 影像live Streaming 部分  ========================= //
//   /** 
//    * 處理自己的streaming
//   */
//  let mediaStreamRecord: any = null 

//   const startStreaming = (socket: any) => {
//     const constraints = {
//       audio: true,
//       video: {  facingMode: "user" }
//     };

//     navigator.mediaDevices.getUserMedia(constraints)
//     .then((mediaStream) => {
//       const video = document.querySelector('#my_liveStreamvideo') as HTMLVideoElement;
//       if(video) {
//         video.srcObject = mediaStream;
//         video.onloadedmetadata = () => {
//           video.play();
//         }
        
//         mediaStreamRecord = new MediaRecorder(mediaStream,{mimeType:'video/x-matroska;codecs=avc1,opus',videoBitsPerSecond: 3000000})
//         mediaStreamRecord.start(1000)
//         mediaStreamRecord.ondataavailable = (event: any) => {
//           // const video = document.querySelector('#stream_liveStreamvideo') as HTMLVideoElement;
//           // if(video) {
//           //   //@ts-ignore
//           //     // video.srcObject = mediaStreamRecord.stream;
//           //     // video.onloadedmetadata = () => {
//           //     //   video.play();
//           //     // }
//           //   // console.log(event.data)
//           // }
//           console.log(event.data)
//           socket.emit('start_streaming',event.data)
//         }
//       };
      
//     })
//     .catch((err) => {
//       // always check for errors at the end.
//       console.error(`${err.name}: ${err.message}`);
//     });
//   }

//   const blobToDataURL = (blob:any, callback: Function) => {
//     var a = new FileReader();
//     a.onload = function(e) {
//       if(e.target){
//         callback(e.target.result);
//       }
//     }
//     a.readAsDataURL(new Blob([blob]));
// }

</script>

<style>
  html{
    color-scheme: dark;
  }
</style>