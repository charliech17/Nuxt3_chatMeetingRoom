<template>
    <div>
        <p>{{ 'hello  ' + $route.path }}</p>
        <div>
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
    import { checkIsRTDBData, getRTDBData } from '@/utils/firebase/useRTDB'
    import { getUserMedia } from '@/utils/baseUtils'
    import { useAuthStore } from '@/stores/authStore'
    import { Peer } from "peerjs";
    import { initPeerSettings } from '@/utils/peerjsUtils'

    // TODO encrypt 會議名稱 & pass
    // TODO　將function抽出來寫
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
            return useRouter().replace('/room')
        }
    }
    checkIsRoomValid()


    // @  載入影像
    const myMedia_display = ref<HTMLVideoElement|null>(null)
    onMounted(()=> {
        nextTick(async ()=> {
            const constraints = {
                audio: true,
                video: { facingMode: "user" },
            }
            const callBackFunction = (stream: MediaStream) => {
                const myVideo = myMedia_display.value as HTMLVideoElement | null
                if(myVideo) {
                    myVideo.srcObject = stream;
                }
            }
            await getUserMedia(constraints,callBackFunction)
            const roomUserList =  await apiService(()=> getRTDBData(userRoomPath))
            
            console.log(roomUserList[0])
        })
    })


    // @ peer settings
    // TODO peer call 時增加別人影像
    const connectUID: ComputedRef<string | null> = computed(() => useAuthStore().uid) 
    let peer: any
    console.log(connectUID,'connect!!!!')
    watch(connectUID, (newValue) => {
        if(newValue) {
            console.log(connectUID,'connect!!!!')
            // @ts-ignore
            peer = new Peer(connectUID.value)
            initPeerSettings({peer})
        }
    })

    // @ call function
    // TODO call other的邏輯處理
    const callAllOtherUser = (roomUserList: {[uuid:string]: string}) => {
        Object.keys(roomUserList).forEach((uuid: string) => {
            if(roomUserList[uuid] !== useAuthStore().uid) return

        }) 
    }
    
</script>