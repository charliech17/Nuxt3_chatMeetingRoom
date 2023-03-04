<template>
    <input 
        class="shadow border rounded py-2 px-3 text-white-700W focus:outline-none focus:shadow-outline"
        name="roomName" 
        :type="type"
        @input="handleInput"
        @change="handleChange"
    >
</template>

<script setup>
    // props
    const props = defineProps({
        type: {type: String, required: true},
        name: {type: String, required: false},
    })
    

    // emit
    const emit = defineEmits(['input', 'change'])


    // method
    function handleInput() {
        emit('input')
    }

    function handleChange() {
        emit('change')
    }
    
</script>