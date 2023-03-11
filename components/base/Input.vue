<template>
    <input 
        class="shadow border rounded py-2 px-3 text-white-700W focus:outline-none focus:shadow-outline"
        name="roomName" 
        :type="type"
        v-model="inputVal"
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
    
    const inputVal = ref('')

    // emit
    const emit = defineEmits(['input', 'change','emitInputVal'])


    // method
    function handleInput() {
        emit('input')
    }

    function handleChange() {
        emit('change')
        emit('emitInputVal',inputVal.value)
    }
    
</script>