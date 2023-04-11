import { io, Socket } from "socket.io-client";
// TODO update socketIO path
let socket: Socket<ServerToClientEvents, ClientToServerEvents>  //= //io('http://localhost:4000/'/*config.public.SOCKET_CONNECTION_URL*/);


export const initSocketSetting = ({onRemoteConnect,onJoinRoomSuccess,onUserLeave,onOther_BG_Change}:socketInitType) => {
    const socketURL = import.meta.env.VITE_SOCKET_CONNECTION_URL as string
    socket = io(socketURL);

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

    socket.on('userToggleBackground',(data: backgroundType)=> {
        onOther_BG_Change(data)
    })
}


export const joinRoomEmit = (data: Object) => {
    socket.emit('JoinRoom',data)
}

export const toggleBackground = 
    (data: backgroundType) => {
        socket.emit('toggleBackground',data)
    }

// ##########  type  ########## 

type backgroundType = {roomPath: string, peerID: string ,isVideoOpen: boolean}

interface socketInitType {
    onRemoteConnect: Function,
    onJoinRoomSuccess: (data: string[]) => void
    onUserLeave: (leavePeerID : string) => void
    onOther_BG_Change: (data: backgroundType) => void
}

interface ServerToClientEvents {
    connection: (data: backgroundType) => void;
    confirmConnection: (data: string) => void
    roomJoinSuccess: (roomPeerList: string[]) => void
    leaveRoom: (data: {leavePeer: string}) => void
    userToggleBackground: (data: backgroundType) => void
}


interface ClientToServerEvents{
    hello: (obj: {name: string,age: number}) => void;
    JoinRoom: (obj: Object) => void;
    toggleBackground: (obj: backgroundType) => void
}
