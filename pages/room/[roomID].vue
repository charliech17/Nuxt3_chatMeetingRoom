<template>
    <div>
        <p>{{ 'hello  ' + $route.path }}</p>
        <p>{{ '是否連接' + isConnect }}</p>
        <div id="insertVideo">
            <video 
                id="myVideo" 
                ref="myMedia_display"
                autoplay
                muted
                playsinline
            />
        </div>
    </div>
</template>


<script lang="ts" setup>
    import { checkIsRTDBData, getRTDBData, setRTDBData } from '@/utils/firebase/useRTDB'
    import { getUserMedia } from '@/utils/baseUtils'
    import { useAuthStore } from '@/stores/authStore'
    import { Peer } from "peerjs";
    import { initPeerSettings, listenPeerEvent, addVideoStream } from '@/utils/connection/peerjsUtils'


    // TODO encrypt 會議名稱 & pass
    // TODO　將function抽出來寫
    const isConnect = ref(false)
    const roomPathSplit = useRoute().path.split('_')
    const baseRoomURL   = roomPathSplit[0] + "/" + roomPathSplit[1]
    const checkRoomPath = baseRoomURL + '/isRoom'
    const userRoomPath  = baseRoomURL + '/uuidList'


    // @ 檢查是否有該房間
    const checkIsRoomValid = async () => {
        const isRoomMeetingValid = await checkIsRTDBData(checkRoomPath)
        // TODO 刪除console
        console.log('isRoomMeetingValid',isRoomMeetingValid)
        if(!isRoomMeetingValid) {
            useRouter().replace('/room')
            return false
        }
        return true
    }


    // @  初始化peer
    const connectUID: ComputedRef<string | null> = computed(() => useAuthStore().uid) 
    const myMedia_display = ref<HTMLVideoElement|null>(null)
    let myStream: undefined | MediaStream;
    let peer: any

    const initPeer = () => {
        if(connectUID.value) {
            startPeer()
        } else {
            watch(connectUID,(newValue)=> {
                if(newValue) {
                    startPeer()
                }
            })
        }
    }


    const startPeer = async () => {
        if(!connectUID.value) return

        const onOpenCallBack = () => {
            isConnect.value = true
            
            nextTick(async ()=> {
                const constraints = {
                    audio: true,
                    video: { facingMode: "user" },
                }
                const callBackFunction = (stream: MediaStream) => {
                    const myVideo = myMedia_display.value as HTMLVideoElement | null
                    if(myVideo) {
                        myStream = stream
                        myVideo.srcObject = stream;
                    }
                    listenPeerEvent({peer,localStream:stream})
                }
                await getUserMedia(constraints,callBackFunction)

                const roomUserList =  await apiService(()=> getRTDBData(userRoomPath)) || {}
                addToUUID_List(roomUserList)
            })
        }
        peer = new Peer(connectUID.value)
        initPeerSettings({peer,onOpenCallBack})
    }
    // initPeer()


    // @  加入uuidList
    // const roomUserList =  await apiService(()=> getRTDBData(userRoomPath))
    const addToUUID_List = async (roomUserList: {[uuid:string]: string}) => {
        const isInList =  Object.values(roomUserList).find((uuid) => uuid === connectUID.value)
        if(!isInList) {
            const uuidListLength = Object.values(roomUserList).length
            const newList = {...roomUserList,[uuidListLength]: connectUID.value}
            await apiService(()=> setRTDBData(userRoomPath,newList))
            callAllOtherUser(newList)
        }
    }


    // @ call function
    // TODO call other的邏輯處理
    const videoIDList: string[] = []
    let videoCurTimeList: number[] = []
    let kickoutCount: number[] = []
    let checkInterval: number | undefined = undefined
    const callAllOtherUser = (roomUserList: {[uuid:string]: string}) => {
        console.log(roomUserList,'roomUserList!!@@##')
        Object.values(roomUserList).forEach((uuid: string) => {
            if(uuid === useAuthStore().uid) return

            const call = peer.call(uuid, myStream)
            call.on("stream", (remoteStream:MediaStream) => {
                addVideoStream({remoteStream,videoIDList,videoCurTimeList,kickoutCount,checkInterval})
            })

        }) 
    }


    // @ main function
    const initRoomEnter = async () => {
        const isRommValid = await checkIsRoomValid()
        if(!isRommValid) return
        initPeer()
    }
    initRoomEnter()
</script>