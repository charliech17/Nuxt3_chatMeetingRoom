<template>
    <div>
        <v-layout class="headerSection">
            <v-app-bar class="position-static" color="primary">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon @click="isShowDrawer = !isShowDrawer"></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title @click="$router.push('/room')">
                    chatApp
                </v-app-bar-title>
                <template v-slot:append>
                    <v-btn icon="mdi-account-circle" v-if="isLogin"></v-btn>
                    <v-btn 
                        v-else
                        variant="tonal" 
                        class="bg-deep-purple-lighten-5 deep-purple-darken-4" 
                        @click="$router.push('/login')"
                    >
                        登入
                    </v-btn>
                </template>
            </v-app-bar>
            <v-navigation-drawer
                class="menu_drawer"
                v-model="isShowDrawer"
                location="top"
                temporary
                :absolute="true"
            >
                <v-list
                :items="navigatorItmes"
                ></v-list>
            </v-navigation-drawer>
        </v-layout>
    </div>
</template>

<script setup>
    const isShowDrawer    = ref(false)
    const navigatorItmes  = reactive([])
    const isLogin         = ref(false)
</script>

<style lang="scss" scoped>
    .headerSection{
        :deep(.v-navigation-drawer__scrim) {
            background-color: lightgray;
            opacity: 0.5;
        }
    }
</style>