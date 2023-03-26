import { io } from "socket.io-client";
// TODO update socketIO path
const config = useRuntimeConfig()
const socket = reactive(io(config.public.SOCKET_CONNECTION_URL));


export const initSocketSetting = ({onSelfConnect,onRemoteConnect}:socketInitType) => {
    socket.on("connection", (socket) => {
        onSelfConnect()
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("connect", () => {
        onRemoteConnect()
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
        socket.emit('hello',{name:'Josh',age:18})
    });

}


export const joinRoomEmit = (data: Object) => {
    socket.emit('JoinRoom',data)
}

// ##########  type  ########## 

interface socketInitType {
    onSelfConnect: Function,
    onRemoteConnect: Function,
}
