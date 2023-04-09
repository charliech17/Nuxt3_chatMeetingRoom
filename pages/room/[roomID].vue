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
                    <div v-if="!videoActiveRef" class="BGImage_wrapper">
                        <img class="video_BGimage" :src="userImg" alt="">
                    </div>
                    <div class="myName">{{ displayName }}</div>
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
            <v-btn stacked :prepend-icon="videoActiveRef ? roomIconsCollections.mdiVideoOutline : roomIconsCollections.mdiVideoOff" variant="tonal" @click="() => pressToggleStream('video')">
                <template v-slot:prepend>
                    <v-icon :color="videoActiveRef ? '' : 'red'"></v-icon>
                </template>
                開啟視訊
            </v-btn>
            <v-btn 
                @click="isEnumrateDeviceDialog = true"
                stacked 
                :prepend-icon="roomIconsCollections.mdiCogTransferOutline" 
                variant="tonal" 
            >
                設備切換
            </v-btn>
            <v-btn 
                stacked 
                :prepend-icon="roomIconsCollections.mdiDotsVertical" 
                variant="tonal" 
            >
                更多功能
            </v-btn>
        </section>
        <v-dialog
            v-model="isDialogOpen"
            width="auto"
            content-class="bg-white"
        >
            <v-card-text>
                <span class="mr-2">是否連接音訊?</span>
                <v-icon :icon="roomIconsCollections.mdiVolumeSource" color="#7E57C2"/>
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
        <v-dialog
            v-model="isEnumrateDeviceDialog"
            transition="dialog-bottom-transition"
            width="auto"
        >
            <v-card>
                <v-card-text class="!p-0">
                    <v-card>
                        <v-tabs
                            v-model="nowTab"
                            bg-color="primary"
                        >
                            <v-tab value="videoDevice">視訊裝置</v-tab>
                            <v-tab value="audioDevice">音訊裝置</v-tab>
                        </v-tabs>
                        <v-card-text>
                            <v-window v-model="nowTab">
                                <v-window-item value="videoDevice">
                                    <v-radio-group v-model="chooseVideoDevice.newChoose">
                                        <v-radio 
                                            color="primary"
                                            :true-icon="roomIconsCollections.mdiRadioboxMarked"
                                            :false-icon="roomIconsCollections.mdiRadioboxBlank"
                                            v-for="device in allVideoInput" 
                                            :label="device.label" 
                                            :value="device.deviceId"
                                        />
                                    </v-radio-group>
                                </v-window-item>

                                <v-window-item value="audioDevice">
                                    <v-radio-group v-model="chooseAudioSource.newChoose">
                                        <v-radio 
                                            color="primary"
                                            :true-icon="roomIconsCollections.mdiRadioboxMarked"
                                            :false-icon="roomIconsCollections.mdiRadioboxBlank"
                                            v-for="device in allMicroInput" 
                                            :label="device.label" 
                                            :value="device.deviceId"
                                        />
                                    </v-radio-group>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>
                    <v-card-actions>
                        <v-btn color="primary" block @click="confirmChangeDevice">確定</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>


<script lang="ts" setup>
    import { checkIsRTDBData } from '@/utils/firebase/useRTDB'
    import { getUserMedia, toggleStreamOutput, enumerateAllSource } from '@/utils/baseUtils'
    import { useAuthStore } from '@/stores/authStore'
    import { use_roomInfo_Store } from '@/stores/roomInfoStore'
    import { Peer } from "peerjs";
    import { initPeerSettings, listenPeerEvent, addVideoStream, sendVideoOpenStatus } from '@/utils/connection/peerjsUtils'
    import { storeToRefs } from 'pinia'
    import { initSocketSetting, joinRoomEmit, toggleBackground } from '@/utils/connection/SocketIO_Utils'
    import { roomIconsCollections } from '@/utils/icons/roomIconUtils'
    // @ts-ignore
    import { v4 as uuidv4 } from 'uuid';

    // TODO encrypt 會議名稱 & pass
    // TODO　將function抽出來寫
    const isConnect = ref(false)
    const roomPathSplit = useRoute().path.split('_')
    const baseRoomURL   = roomPathSplit[0] + "/" + roomPathSplit[1]
    const checkRoomPath = baseRoomURL + '/isRoom'


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
                    const bgImage = document.getElementById(otherBackgroundInfo.peerID)?.querySelector('.bg_wrapper_div') as HTMLDivElement
                    console.log(otherBackgroundInfo, bgImage)
                    if(bgImage) {
                        bgImage.style.display = otherBackgroundInfo.isVideoOpen ? 'none' : 'block'
                    }
                }
            })
        })
    }


    // @ call function
    const videoIDList: string[] = []
    const callAllOtherUser = (roomPeerList: string[]) => {
        console.log(roomPeerList,'roomPeerList!!@@##')
        roomPeerList.forEach((eachPeer: string) => {
            const call = peer.call(eachPeer, myStream)
            call.on("stream", (remoteStream:MediaStream) => {
                addVideoStream({remoteStream,videoIDList,call,isConnectAudioRef: isSoundConnect})
                sendVideoOpenStatus(peer,call,'after')
            })
        }) 
    }


    // @  列出所有音訊、視訊裝置，找出目前使用的裝置
    const getDeviceSource = async () => {
        await enumerateAllSource(allVideoInput,allMicroInput)
        if(myStream) {
            console.log(allMicroInput.value,'allMicroInput')
            const nowVideoTrackId = myStream.getVideoTracks()[0].getSettings().deviceId
            const nowAudioTrackId = myStream.getAudioTracks()[0].getSettings().deviceId
            chooseVideoDevice.value.newChoose = nowVideoTrackId || ''
            chooseVideoDevice.value.confirm   = nowVideoTrackId || ''
            chooseAudioSource.value.newChoose = nowAudioTrackId || ''
            chooseAudioSource.value.confirm   = nowAudioTrackId || ''
        }
    }


    // @ 畫面事件
    const isSoundConnect = ref(false)
    const videoActiveRef = ref(false)
    const soundActiveRef = ref(false)
    const isDialogOpen = ref(false)
    const isEnumrateDeviceDialog = ref(false)
    const nowTab = ref('videoDevice')
    const chooseVideoDevice = ref({newChoose: '', confirm: ''}) 
    const chooseAudioSource = ref({newChoose: '', confirm: ''})
    const allVideoInput = ref([]) as Ref<MediaDeviceInfo[]>
    const allMicroInput = ref([]) as Ref<MediaDeviceInfo[]>


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
        const allOtherVideo = document.querySelectorAll('#insertVideo > div > video:not(#myVideo)') as NodeListOf<HTMLVideoElement>
            console.log(allOtherVideo)
        for(let video of allOtherVideo) {
            video.muted = false
            video.play()
        }
        isDialogOpen.value = false
    }


    const confirmChangeDevice = async () => {
        console.log(chooseAudioSource.value,'audio')
        const constraints = {
            video: {deviceId: { exact:  chooseVideoDevice.value.confirm}},
            audio: {deviceId: { exact:  chooseAudioSource.value.confirm}},
        }
        
        // if(chooseVideoDevice.value.newChoose !== chooseVideoDevice.value.confirm) {
        //     const newChooseVideoID  = chooseVideoDevice.value.newChoose
        //     constraints.video.deviceId.exact = newChooseVideoID
        //     chooseVideoDevice.value.confirm  = newChooseVideoID
        // }

        // if(chooseAudioSource.value.newChoose !== chooseAudioSource.value.confirm) {
        //     const newChooseAudioID = chooseAudioSource.value.newChoose
        //     constraints.audio.deviceId.exact = newChooseAudioID
        //     chooseAudioSource.value.confirm  = newChooseAudioID
        // }
        
        // TODO 切換視音訊
        chooseVideoDevice.value.newChoose = chooseVideoDevice.value.confirm
        chooseAudioSource.value.newChoose = chooseAudioSource.value.confirm
        // myStream = await getUserMedia(constraints)
        // Object.values(peer.connections).forEach((conn: any)=> { 
        //     console.log(conn[0].peerConnection.getSenders())
        //     conn[0].peerConnection.getSenders().replace
        // })
        isEnumrateDeviceDialog.value = false
    }


    const audioIcon = computed(()=> {
        if(isSoundConnect.value) {
            return soundActiveRef.value ? roomIconsCollections.mdiMicrophoneOutline : roomIconsCollections.mdiMicrophoneOff
        } else {
            return roomIconsCollections.mdiVolumeOff
        }
    })


    const audioIconColor = computed(()=> {
        if(isSoundConnect.value) {
            return soundActiveRef.value ? '' : 'red'
        } else {
            return 'red'
        }
    })


    const displayName = computed(()=> {
        return useAuthStore().displayName
    })


    const userImg = computed(()=> {
        const saveURL = useAuthStore().photoURL
        const userImgurl = saveURL ? saveURL : 'https://source.unsplash.com/random/1920x1081'
        return userImgurl
    })
    
    // @ main function
    const initRoomEnter = async () => {
        const isLogin = await watchLoginStatus()
        const isRommValid = await checkIsRoomValid()
        if(!isRommValid || !isLogin) return navigateTo('/room')
        await startPeer()
        await startWebSocket()
        await getDeviceSource()
    }
    apiService(initRoomEnter)
    
</script>

<style lang="scss" scoped>
    #insertVideo{
        display: grid;
        grid-template-columns: 1fr 1fr;

        .BGImage_wrapper{
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
            height: 100%;
            background-color: black;
            z-index: 2;
            .video_BGimage{
                width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }

        .myName{
            position: absolute;
            bottom: 0px;
            right: 0px;
            background-color: black;
            max-width: 60px;
            color: white;
            padding: 2px;
            z-index: 2;
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