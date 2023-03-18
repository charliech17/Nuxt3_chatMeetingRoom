<template>
    <div>
        <div>
            {{ '是否連接' + isConnected ? '是' : '否' }}
        </div>
        <div>
            {{ '連接id' + connectID }}
        </div>
        <div>
            {{ '收到訊息:  ' + socketMessage}}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { io } from "socket.io-client";
const isConnected = ref(false)
const connectID   = ref('')
const socketMessage = ref('')
const config = useRuntimeConfig()
const socket = reactive(io(config.public.SOCKET_CONNECTION_URL));

socket.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("connect", () => {
    isConnected.value = true
    connectID.value = socket.id
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit('hello',{name:'Josh',age:18})
});

socket.on("disconnect", () => {
    isConnected.value = false
    connectID.value = socket.id
    console.log(socket.id); // undefined
});

socket.on('asd',(message)=>{
    socketMessage.value = message 
})

</script>