<template>
    <div>
        <canvas id="liveCanvas"></canvas>
        <video 
            class="d-none"
            id="liveStreamInput" 
            autoplay
            muted
            playsinline
        />
        <div class="mt-4">
            <v-btn 
            class="mr-2"
                @click="startScan"
            >
                開始掃描
            </v-btn>
            <v-btn @click="textOCR">掃描圖片</v-btn>
        </div>
        <div class="mt-4">
            <canvas id="backCanvas"></canvas>
        </div>
        <div>{{ scanTxt }}</div>
    </div>
</template>

<script lang="ts" setup>
    import { getUserMedia } from "@/utils/baseUtils"
    import Tesseract from 'tesseract.js';

    const canvasSize = window.innerWidth - 32
    const scanFramelength = canvasSize - 40
    const scanFramewidth = scanFramelength * (53/85)

    const startXPoint =  20 + scanFramelength * (9/85)
    const startYPoint = 20 + scanFramelength * (32/85)
    const detectLength1 = scanFramelength * (62/85)
    const detectWidth1 = scanFramelength * (4/85)

    const scanTxt = ref('')
    

    onMounted(()=> {
        const canvas = document.getElementById('liveCanvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')

        if(!ctx) return
        canvas.width = canvasSize
        canvas.height = canvasSize
    })

    async function startScan() {
        const constraints = {
            audio: true,
            video: true,
        }
        const stream = await getUserMedia(constraints)
        const video = document.getElementById('liveStreamInput') as HTMLVideoElement
        if(video) {
            video.srcObject = stream
            video.onloadedmetadata = () => {
                video.play()
                function drawImage() {
                    createLiveStreamStroke(video)
                    requestAnimationFrame(drawImage);
                }
                requestAnimationFrame(drawImage)
            }
        }
    }

    function createLiveStreamStroke(video: HTMLVideoElement) {
        const canvas = document.getElementById('liveCanvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')
        if(!ctx) return

        ctx.drawImage(video, 0, 0, canvasSize, canvasSize);
        ctx.beginPath();
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = 3;
        // ctx.moveTo(0,0);
        // ctx.lineTo(0,canvasSize)
        // ctx.lineTo(canvasSize,canvasSize)
        // ctx.lineTo(0,canvasSize)
        // ctx.closePath()
        // ctx.stroke();


        // ctx.beginPath();
        // ctx.arc(100, 200, 50, 0, 2 * Math.PI);
        // ctx.stroke();

        // ctx.beginPath();

        ctx.moveTo(20,20);
        ctx.lineTo(20 + scanFramelength,20)
        ctx.lineTo(20 + scanFramelength,20 + scanFramewidth)
        ctx.lineTo(20, 20 + scanFramewidth)
        ctx.closePath()
        ctx.stroke();

        ctx.beginPath(); 
       
        ctx.moveTo(startXPoint, startYPoint)
        ctx.lineTo(startXPoint+detectLength1,startYPoint)
        ctx.lineTo(startXPoint+detectLength1,startYPoint+detectWidth1 )
        ctx.lineTo(startXPoint, startYPoint+detectWidth1)
        ctx.closePath()
        ctx.stroke();
    }

    function textOCR() {
        const canvas = document.getElementById('liveCanvas') as HTMLCanvasElement
        const ctx = canvas.getContext('2d')
        const backCanvas = document.getElementById('backCanvas') as HTMLCanvasElement //document.createElement('canvas');
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        const backCtx = backCanvas.getContext('2d');
        
        if(!backCtx || !ctx) return
        const imageData = ctx.getImageData(20,20,scanFramelength,scanFramewidth)//ctx.getImageData(startXPoint + scanFramelength * (9/85) ,startYPoint + scanFramelength * (32/85),detectLength1,detectWidth1)
        backCtx.putImageData(imageData,0,0);

        Tesseract.recognize(
        backCanvas.toDataURL(),
        'eng',
        { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log(text);
            scanTxt.value = text
        })
    }
</script>