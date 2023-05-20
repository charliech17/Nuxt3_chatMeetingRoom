<template>
    <div>
        <canvas ref="canvasRef" style="margin: auto;"></canvas>
        <v-btn @click="startRotate">開始旋轉</v-btn>
        
    </div>
</template>

<script setup lang="ts">
    const canvasRef = ref<HTMLCanvasElement|null>(null)
    const canvasLength = ref(0)
    const deg: number[][] = []
    const data = [ 100, 100, 100, 100, 100, 100 ]; 
    const colors = [ "orange", "green", "blue", "yellow", "teal", "purple"]; 
    const innerText = ["大苑子","CoCo","五十嵐","龜記","清原","日日裝茶"]
    const total = data.reduce((prev,curr)=> {
        return prev + curr
    })

    onMounted(()=> {
        if(canvasRef.value) {
            const resizeFactor = 0.8
            canvasLength.value = window.innerWidth * resizeFactor
            canvasRef.value.width =  canvasLength.value
            canvasRef.value.height = canvasLength.value

            drawCircle()
        }
    })


    function drawCircle() {
        const canvasHalfLength = canvasLength.value / 2
        const canvasRadius = canvasHalfLength
        if(!canvasRef.value) return
        const ctx = canvasRef.value.getContext('2d') 
        if(!ctx) return
        
        let prevAngle = 0; 
        for(let i=0; i<data.length; i++) { 
            
            let fraction = data[i]/total; 
            let angle = prevAngle + fraction*Math.PI*2; 
            deg.push([prevAngle,angle])
            ctx.fillStyle = colors[i]; 
            
            //create a path 
            ctx.beginPath(); 
            ctx.moveTo(canvasHalfLength,canvasHalfLength); 
            ctx.arc(canvasHalfLength,canvasHalfLength, canvasRadius, prevAngle, angle, false); 

            ctx.lineTo(canvasHalfLength,canvasHalfLength); 
            //fill it 
            ctx.fill(); 
            
            //stroke it 
            ctx.strokeStyle = "black"; 
            ctx.stroke(); 

            ctx.beginPath(); 
            const textAngle =  (angle + prevAngle) * 0.5
            const ratioRadius = canvasHalfLength * 0.7
            const xPoint = canvasHalfLength + (ratioRadius * Math.cos(textAngle))
            const yPoint = canvasHalfLength+ (ratioRadius * Math.sin(textAngle))
            
            console.log(xPoint,yPoint)
            ctx.font = "16px bold Arial";
            ctx.fillStyle = 'black'; 
            const textWidth = ctx.measureText(innerText[i])
            console.log('textWidth',textWidth)
            ctx.fillText(innerText[i],(xPoint - (textWidth.width*0.5)),yPoint)
            
            //update for next time through the loop 
            prevAngle = angle; 
        } 
    }

    function startRotate() {
        if(!canvasRef.value) return
        const isRotate = canvasRef.value.classList.contains('animate_rotate')
        
        if(!isRotate) {
            canvasRef.value.classList.add('animate_rotate')
        } else {
            const randomNum = Math.random()*Math.PI*2
            for(let i=0; i< deg.length;i++) {
                if(randomNum>deg[i][0] && randomNum<deg[i][1]) {
                    shineCircle(i)
                }
            }
            canvasRef.value.classList.remove('animate_rotate')
        }
    }

    function shineCircle(shineIndex: number) {
        console.log('shineIndex',shineIndex)
        let shineFlag = true
        let count = 0
        const canvasHalfLength = canvasLength.value / 2
        const canvasRadius = canvasHalfLength
        let shineInterval = setInterval(()=> {
            if(!canvasRef.value) return

            const ctx = canvasRef.value.getContext('2d') 
            if(!ctx) return

            ctx.beginPath(); 
            if(shineFlag && count < 6) {
                ctx.fillStyle = "white"; 
                count++
            } else {
                ctx.fillStyle = colors[shineIndex]; 
            }

            if(count === 6) {
                ctx.fillStyle = colors[shineIndex]; 
                clearInterval(shineInterval)
            }

            ctx.moveTo(canvasHalfLength,canvasHalfLength); 
            ctx.arc(canvasHalfLength,canvasHalfLength, canvasRadius, deg[shineIndex][0], deg[shineIndex][1], false); 
            ctx.lineTo(canvasHalfLength,canvasHalfLength); 
            ctx.fill(); 
            shineFlag = !shineFlag

            
        },250)
    }

</script>

<style lang="scss" scoped>
    @keyframes spin_roller {
        0% {
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
    .animate_rotate {
        animation: spin_roller 0.3s infinite;
    }
</style>