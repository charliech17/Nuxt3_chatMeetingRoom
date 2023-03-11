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
                    <v-btn 
                        icon="mdi-account-circle" 
                        @click="isShowUserInfo = !isShowUserInfo" 
                        v-if="isLogin"
                    />
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
            <v-navigation-drawer
                v-model="isShowUserInfo"
                class="userInfo_drawer"
                temporary
                location="right"
            >
                <template v-slot:prepend>
                    <!-- TODO 更換頭像 title -->
                    <v-list-item
                        lines="two"
                        prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
                        title="yourName"
                        subtitle="Logged in"
                    />
                </template>
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"/>
                    <v-list-item prepend-icon="mdi-account" title="My Account" value="account"/>
                    <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" @click="logoutUser"/>
                </v-list>
            </v-navigation-drawer>
        </v-layout>
        <div class="userInfoDrawer">
            
        </div>
    </div>
</template>

<script setup>
    import { useAuthStore } from '@/stores/authStore'
    import { signOutUser } from '@/utils/firebase/auth'
    
    const isShowDrawer    = ref(false)
    const isShowUserInfo  = ref(false)
    const navigatorItmes  = reactive([])
    const isLogin         = computed(() => useAuthStore().isAuth)

    const logoutUser = async () => {
        await signOutUser()
        isShowUserInfo.value = false
        useRouter().replace('/')
    }

</script>

<style lang="scss" scoped>
    .headerSection{
        :deep(.v-navigation-drawer__scrim) {
            background-color: lightgray;
            opacity: 0.5;
        }

        
        :deep(.userInfo_drawer){
            height: fit-content !important;
        }
    }
</style>