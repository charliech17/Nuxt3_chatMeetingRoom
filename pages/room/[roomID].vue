<template>
    <div>
        <section class="mainContetSection">
            <p>{{ 'hello  ' + $route.path }}</p>
            <p>{{ '是否連接' + isConnect }}</p>
            <div id="insertVideo">
                <div class="position-relative">
                    <video 
                        poster="@/assets/image/laughFace.avif"
                        id="myVideo" 
                        ref="myMedia_display"
                        autoplay
                        muted
                        playsinline
                    />
                    <img v-if="!videoActiveRef" class="video_BGimage" src="@/assets/image/laughFace.avif" alt="">
                </div>
            </div>
        </section>
        <section class="bottomControlStyle">
            <v-btn 
                stacked 
                :prepend-icon="audioIcon" 
                variant="tonal" 
                @click="() => pressToggleStream('audio')"
            >
                <template v-slot:prepend>
                    <v-icon :color="audioIconColor"></v-icon>
                </template>
                連接音訊
            </v-btn>
            <v-btn stacked :prepend-icon="videoActiveRef ? 'mdi-video-outline' : 'mdi-video-off'" variant="tonal" @click="() => pressToggleStream('video')">
                <template v-slot:prepend>
                    <v-icon :color="videoActiveRef ? '' : 'red'"></v-icon>
                </template>
                開啟視訊
            </v-btn>
            <v-btn stacked prepend-icon="mdi-monitor-share" variant="tonal" >
                分享畫面
            </v-btn>
            <v-btn stacked prepend-icon="mdi-dots-vertical" variant="tonal" >
                更多功能
            </v-btn>
        </section>
        <v-dialog
            v-model="isDialogOpen"
            width="auto"
            content-class="bg-white"
        >
            <v-card-text>
                是否連接音訊?
            </v-card-text>
            <v-card-actions>
                <v-btn 
                    color="primary" 
                    @click="isDialogOpen = false"
                >
                不要連接
                </v-btn>
                <v-btn 
                    color="primary" 
                    @click="handleConnectAudio"
                >
                連接音訊
                </v-btn>
            </v-card-actions>
        </v-dialog>
    </div>
</template>


<script lang="ts" setup>
    import { checkIsRTDBData } from '@/utils/firebase/useRTDB'
    import { getUserMedia, toggleStreamOutput } from '@/utils/baseUtils'
    import { useAuthStore } from '@/stores/authStore'
    import { use_roomInfo_Store } from '@/stores/roomInfoStore'
    import { Peer } from "peerjs";
    import { initPeerSettings, listenPeerEvent, addVideoStream } from '@/utils/connection/peerjsUtils'
    import { storeToRefs } from 'pinia'
    import { initSocketSetting, joinRoomEmit, toggleBackground } from '@/utils/connection/SocketIO_Utils'
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
            use_roomInfo_Store().setVideoStaus(true)
        }
        listenPeerEvent({peer,localStream:stream,isConnectAudioRef: isSoundConnect})
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
                },
                onJoinRoomSuccess: (roomPeerList) => {
                    callAllOtherUser(roomPeerList)
                },
                onUserLeave: (leavePeerID) => {
                    document.getElementById(leavePeerID)?.remove()
                },
                onOther_BG_Change: (otherBackgroundInfo) => {
                    const bgImage = document.getElementById(otherBackgroundInfo.peerID)?.querySelector('img')
                    console.log(otherBackgroundInfo, bgImage)
                    if(bgImage) {
                        bgImage.style.display = otherBackgroundInfo.isVideoOpen ? 'none' : 'block'
                    }
                }
            })
        })
    }


    // @ call function
    // TODO call other的邏輯處理
    const videoIDList: string[] = []
    const callAllOtherUser = (roomPeerList: string[]) => {
        console.log(roomPeerList,'roomPeerList!!@@##')
        roomPeerList.forEach((eachPeer: string) => {
            const call = peer.call(eachPeer, myStream)
            call.on("stream", (remoteStream:MediaStream) => {
                addVideoStream({remoteStream,videoIDList,call,isConnectAudioRef: isSoundConnect})
            })
        }) 
    }


    // @ 畫面事件
    const isSoundConnect = ref(false)
    const videoActiveRef = ref(false)
    const soundActiveRef = ref(false)
    const isDialogOpen = ref(false)
    const pressToggleStream = (inputType: 'video' | 'audio') => {
        if(inputType === 'audio' && !isSoundConnect.value) return handleSoundActive()

        const _toggle_BG_function = (isVideoOpen: boolean) => {
            toggleBackground({roomPath: baseRoomURL,peerID: peerUUID, isVideoOpen})
        }
        toggleStreamOutput(myStream,inputType,videoActiveRef,soundActiveRef,_toggle_BG_function)
    }


    const handleSoundActive = () => {
        isDialogOpen.value = true
    }


    const handleConnectAudio = () => {
        isSoundConnect.value = true
        const allOtherVideo = document.querySelectorAll('#insertVideo > video:not(#myVideo)') as NodeListOf<HTMLVideoElement>
            console.log(allOtherVideo)
        for(let video of allOtherVideo) {
            video.muted = false
            video.play()
        }
        isDialogOpen.value = false
    }


    const audioIcon = computed(()=> {
        if(isSoundConnect.value) {
            return soundActiveRef.value ? 'mdi-microphone-outline' : 'mdi-microphone-off'
        } else {
            return 'mdi-volume-off'
        }
    })


    const audioIconColor = computed(()=> {
        if(isSoundConnect.value) {
            return soundActiveRef.value ? '' : 'red'
        } else {
            return 'red'
        }
    })
    
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

        .video_BGimage{
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
        }
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