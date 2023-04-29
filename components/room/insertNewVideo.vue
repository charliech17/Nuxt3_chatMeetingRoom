<template>
    <video 
        class="w-100"
        autoplay
        playsinline
        ref="videoShow"
    />
    <div class="bg_wrapper_div" style="position: absolute; top:0; left: 0; background: black; height: 100%; width: 100%; display: none;" >
        <img 
            style="position: absolute; top:50%; left: 50%; transform: translate(-50%,-50%); width:100%; max-height: 100%; object-fit: contain; z-index: 2;"
            src="https://source.unsplash.com/random/1920x1081" 
        />
    </div>
    <div 
        class="nameSection"
        style="position: absolute; bottom: 0px; right: 0px; background-color: black; max-width: 60px; color: white; padding: 2px; z-index: 2;"
    />
</template>