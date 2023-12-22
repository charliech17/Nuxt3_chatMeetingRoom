<template>
    <div class="base_icon"></div>
    <div class="circle_outline" ref="circleRef">
        <div class="cross_line inner_line"></div>
        <div class="vertical_line inner_line"></div>
        <div class="inner_text inner_top_text">大苑子</div>
        <div class="inner_text inner_right_text">coco</div>
        <div class="inner_text inner_left_text">五十嵐</div>
        <div class="inner_text inner_bottom_text">龜記</div>
        <div class="result_color_circle" ref="resultMarkRef"></div>
        <!-- <div style="left: 50%; top: 15%; width: 250px;height: 250px;border-radius: 0 250px 0 0;background-color: aqua; position: absolute;opacity: 0.8;transform:translate(-50%,-50%) rotate(-45deg);"></div>
        <div style="left: 0%; top: 0%; width: 250px;height: 250px;border-radius: 0 0 250px 0;background-color: red; position: absolute;opacity: 0.8;transform:rotate(-45deg);"></div> -->
    </div>
    <v-btn @click="startRotate">
        開始旋轉
    </v-btn>
</template>

<script setup lang="ts">
    const circleRef = ref<HTMLDivElement|null>(null)
    const resultMarkRef = ref<HTMLDivElement|null>(null)
    const startRotate = () => {
        const isRotate = circleRef.value!.classList.contains('animate_rotate')
        if(isRotate) {
            const stopDeg = Math.random() * 1000 % 360
            if(stopDeg < 45  || stopDeg > 315) {
                resultMarkRef.value!.style.transform = `rotate(-45deg)`
            }
            if(stopDeg > 45  && stopDeg < 135) {
                resultMarkRef.value!.style.transform = `rotate(225deg)`
            }
            if(stopDeg > 135  && stopDeg < 225) {
                resultMarkRef.value!.style.transform = `rotate(135deg)`
            }
            if(stopDeg > 225  && stopDeg < 315) {
                resultMarkRef.value!.style.transform = `rotate(45deg)`
            }

            resultMarkRef.value!.style.display = 'block'
            circleRef.value!.style.transform = `rotate(${stopDeg}deg)`
            circleRef.value!.classList.remove('animate_rotate')
        } else if(!isRotate) {
            resultMarkRef.value!.style.display = 'none'
            circleRef.value!.style.transform = ''
            circleRef.value!.classList.add('animate_rotate')
        }
    }
</script>


<style lang="scss" scoped>
    .base_icon{
        background: url("@/assets/image/arrow.png");
        background-size: contain;
        width: 50px;
        height: 50px;
        transform: rotate(90deg);
        margin: 0px auto -20px auto;
        z-index: 3;
        position: relative;
    }

    $circle_length: 80vw;
    $circle_max_width: 600px;
    .circle_outline{
        width: $circle_length;
        height: $circle_length;
        max-width: $circle_max_width;
        max-height: $circle_max_width;
        border-radius: 50%;
        border: 2px solid white;
        position: relative;
        margin: auto;
        z-index: 2;

        .result_color_circle{
            width: calc($circle_length / 2);
            height: calc($circle_length / 2);
            max-width: calc($circle_max_width / 2);
            max-height: calc($circle_max_width / 2);
            left: 50%;
            border-radius: 0 calc($circle_length / 2) 0 0;
            background-color: rgb(50, 234, 234); 
            position: absolute;
            transform-origin: left bottom;
            transform: rotate(-45deg);
            display: none;
        }
        .inner_line{
            position: absolute;
            border: 2px solid white;
        }
        .cross_line{
            width: $circle_length;
            max-width: $circle_max_width;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
        }
        .vertical_line{
            height: $circle_length;
            max-height: $circle_max_width;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
        }

        .inner_text{
            position: absolute;
            z-index: 2;
            text-align: center;
            font-size: 24px;
            font-weight: 900;
        }

        .inner_top_text{
            left: 50%;
            top: 20%;
            transform: translate(-50%, -50%);
        }

        .inner_right_text{
            left: 80%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .inner_left_text{
            left: 25%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        .inner_bottom_text{
            left: 50%;
            top: 80%;
            transform: translate(-50%, -50%);
        }
    }

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