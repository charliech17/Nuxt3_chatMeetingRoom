import { io, Socket } from "socket.io-client";
// TODO update socketIO path
const config = useRuntimeConfig()
let socket: Socket<ServerToClientEvents, ClientToServerEvents>  //= //io('http://localhost:4000/'/*config.public.SOCKET_CONNECTION_URL*/);


export const initSocketSetting = ({onRemoteConnect}:socketInitType) => {
    socket = io(config.public.SOCKET_CONNECTION_URL);

    socket.on("connect", () => {
        onRemoteConnect(socket.id)
        socket.emit('hello',{name:'Josh',age:18})
    });

    socket.on('confirmConnection',(data: string)=> {
        console.log(data)
    })

    socket.on('roomJoinSuccess',(data: string[])=> {
        console.log('roomJoinSuccess',data)
    })

}


export const joinRoomEmit = (data: Object) => {
    socket.emit('JoinRoom',data)
}

// ##########  type  ########## 

interface socketInitType {
    onRemoteConnect: Function,
}

interface ServerToClientEvents {
    connection: () => void;
    confirmConnection: (data: string) => void
    roomJoinSuccess: (data: string[]) => void
}


interface ClientToServerEvents{
    hello: (obj: {name: string,age: number}) => void;
    JoinRoom: (obj: Object) => void;
}
