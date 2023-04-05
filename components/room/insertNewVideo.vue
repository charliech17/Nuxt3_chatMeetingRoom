<template>
    <video 
        autoplay
        playsinline
        ref="videoShow"
    />
    <div class="bg_wrapper_div" style="position: absolute; top:0; left: 0; background: black; height: 100%; width: 100%; display: none;" >
        <img 
            style="position: absolute; top:50%; left: 50%; transform: translate(-50%,-50%); width:100%; z-index: 2;"
            src="https://source.unsplash.com/random/1920x1081" 
        />
    </div>
</template>