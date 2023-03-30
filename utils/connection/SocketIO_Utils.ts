import { io, Socket } from "socket.io-client";
// TODO update socketIO path
const config = useRuntimeConfig()
let socket: Socket<ServerToClientEvents, ClientToServerEvents>  //= //io('http://localhost:4000/'/*config.public.SOCKET_CONNECTION_URL*/);


export const initSocketSetting = ({onRemoteConnect,onJoinRoomSuccess,onUserLeave}:socketInitType) => {
    socket = io(config.public.SOCKET_CONNECTION_URL);

    socket.on("connect", () => {
        onRemoteConnect(socket.id)
        socket.emit('hello',{name:'Josh',age:18})
    });

    socket.on('confirmConnection',(data: string)=> {
        console.log(data)
    })

    socket.on('roomJoinSuccess',(roomPeerList: string[])=> {
        onJoinRoomSuccess(roomPeerList)
    })

    socket.on('leaveRoom',(data: {leavePeer: string})=> {
        onUserLeave(data.leavePeer)
    })
}


export const joinRoomEmit = (data: Object) => {
    socket.emit('JoinRoom',data)
}

// ##########  type  ########## 

interface socketInitType {
    onRemoteConnect: Function,
    onJoinRoomSuccess: (data: string[]) => void
    onUserLeave: (leavePeerID : string) => void
}

interface ServerToClientEvents {
    connection: () => void;
    confirmConnection: (data: string) => void
    roomJoinSuccess: (roomPeerList: string[]) => void
    leaveRoom: (data: {leavePeer: string}) => void
}


interface ClientToServerEvents{
    hello: (obj: {name: string,age: number}) => void;
    JoinRoom: (obj: Object) => void;
}
