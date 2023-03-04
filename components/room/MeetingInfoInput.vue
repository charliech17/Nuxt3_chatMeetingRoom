<template>
    <main>
        <div>
            <label class="mr-4" for="roomName">
                <slot name="meetingCode"></slot>
            </label>
            <BaseInput
                name="roomName"
                type="number"
            />
        </div>
        <div>
            <label class="mr-4" for="roomPassword">
                <slot name="meetingPassword"></slot>
            </label>
            <BaseInput
                name="roomPassword"
                type="password"
            />
        </div>
    </main>
</template>