<template>
    <div>
        <section class="mainContetSection">
            <p>{{ 'hello  ' + $route.path }}</p>
            <p>{{ '是否連接' + isConnect }}</p>
            <div id="insertVideo">
                <video 
                    poster="@/assets/image/laughFace.avif"
                    id="myVideo" 
                    ref="myMedia_display"
                    autoplay
                    muted
                    playsinline
                />
            </div>
        </section>
        <section class="bottomControlStyle">
            <v-btn stacked :prepend-icon="soundActiveRef ? 'mdi-microphone-outline' : 'mdi-volume-off'" variant="tonal" @click="() => pressToggleStream('audio')">
                連接音訊
            </v-btn>
            <v-btn stacked :prepend-icon="videoActiveRef ? 'mdi-video-outline' : 'mdi-video-off'" variant="tonal" @click="() => pressToggleStream('video')">
                開啟視訊
            </v-btn>
            <v-btn stacked prepend-icon="mdi-monitor-share" variant="tonal" >
                分享畫面
            </v-btn>
            <v-btn stacked prepend-icon="mdi-dots-vertical" variant="tonal" >
                更多功能
            </v-btn>
        </section>
    </div>
</template>


<script lang="ts" setup>
    import { checkIsRTDBData, getRTDBData, setRTDBData } from '@/utils/firebase/useRTDB'
    import { getUserMedia, toggleStreamOutput } from '@/utils/baseUtils'
    import { useAuthStore } from '@/stores/authStore'
    import { Peer } from "peerjs";
    import { initPeerSettings, listenPeerEvent, addVideoStream } from '@/utils/connection/peerjsUtils'
    import { storeToRefs } from 'pinia'
    import { initSocketSetting, joinRoomEmit } from '@/utils/connection/SocketIO_Utils'
    // @ts-ignore
    import { v4 as uuidv4 } from 'uuid';


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
            return false
        }
        return true
    }


    // @ 檢查是否登入
    const watchLoginStatus = async () => {
        const authStore = useAuthStore()
        if(authStore.isAuth === false) return false
        const { isAuth } = storeToRefs(authStore)
        return new Promise((resolve) => {
            watch(isAuth,(newAuth) => {
                if(newAuth === false) {
                    return resolve(false)
                } else if(newAuth === true) {
                    return resolve(true)
                }
            })
        })
    }


    // @  初始化peer
    const connectUID: ComputedRef<string | null> = computed(() => useAuthStore().uid) 
    const myMedia_display = ref<HTMLVideoElement|null>(null)
    let myStream: undefined | MediaStream;
    let peer: any
    let peerUUID: string

    const startPeer = async () => {
        // peer settings
        peerUUID = uuidv4()
        peer = new Peer(peerUUID)
        await initPeerSettings({peer})
        isConnect.value = true

        // 開始視訊
        const constraints = {
            audio: true,
            video: { facingMode: "user" },
        }
        const stream = await getUserMedia(constraints)
        const myVideo = myMedia_display.value as HTMLVideoElement | null
        if(myVideo) {
            myStream = stream
            myVideo.srcObject = stream;
            videoActiveRef.value = true
            soundActiveRef.value = true
        }
        listenPeerEvent({peer,localStream:stream})
    }


    // @ 連接websocket
    const startWebSocket = () => {
        return new Promise((resolve) => {
            initSocketSetting({
                onRemoteConnect:(socketID: string)=> {
                    const roomInfo = {
                        [socketID]:{
                            uid:connectUID.value,
                            peerID: peerUUID,
                            roomPath: baseRoomURL,
                        }
                    }
                    joinRoomEmit(roomInfo)
                    resolve('')
                }
            })
        })
    }

    // @  加入uuidList
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


    // @ 畫面事件
    const videoActiveRef = ref(false)
    const soundActiveRef = ref(false)
    const pressToggleStream = (inputType: 'video' | 'audio') => {
        toggleStreamOutput(myStream,inputType,videoActiveRef,soundActiveRef)
    }

    
    // @ main function
    const initRoomEnter = async () => {
        const isLogin = await watchLoginStatus()
        const isRommValid = await checkIsRoomValid()
        if(!isRommValid || !isLogin) return useRouter().replace('/room')
        await startPeer()
        await startWebSocket()
        
    }
    initRoomEnter()
</script>

<style lang="scss" scoped>
    #insertVideo{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    $bottomControlHeight: 80px;
    .mainContetSection{
        height: calc(var(--vh, 1vh)* 100 - var(--headerHeight) - $bottomControlHeight - 32px);
        overflow: auto;
    }
    .bottomControlStyle{
        height: $bottomControlHeight;
        width: calc(100% + 32px);
        margin: 0 -16px;
        background-color: #3a3a3a;
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 10px;
        justify-content: center;
    }
</style>