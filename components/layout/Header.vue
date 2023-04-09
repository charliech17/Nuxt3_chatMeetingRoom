<template>
    <div>
        <v-layout class="headerSection">
            <v-app-bar class="position-static" color="primary">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon :icon="mdiMenu" @click="isShowDrawer = !isShowDrawer"></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title @click="$router.push('/room')">
                    chatApp
                </v-app-bar-title>
                <template v-slot:append>
                    <v-btn 
                        :icon="mdiAccountCircle" 
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
                        :prepend-avatar="userImg"
                        :title="userName"
                        subtitle="Logged in"
                    />
                </template>
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item :prepend-icon="mdiHomeCity" title="首頁" value="home" @click="$router.push('/');isShowDrawer = false; "/>
                    <v-list-item :prepend-icon="mdiAccount" title="更改資訊" value="account" @click="changeUserInfo"/>
                    <v-list-item :prepend-icon="mdiLogout" title="登出" value="logout" @click="logoutUser"/>
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
    import mdiAccountCircle from '~icons/mdi/account-circle'
    import mdiHomeCity from '~icons/mdi/home-city'
    import mdiAccount from '~icons/mdi/account'
    import mdiLogout from '~icons/mdi/logout'
    import mdiMenu from '~icons/mdi/menu'
    
    const isShowDrawer    = ref(false)
    const isShowUserInfo  = ref(false)
    const navigatorItmes  = reactive([])
    const isLogin         = computed(() => useAuthStore().isAuth)
    const userName = computed(()=> {
        return useAuthStore().displayName
    })
    const userImg = computed(()=> {
        const saveURL = useAuthStore().photoURL
        const userImgurl = saveURL ? saveURL : 'https://randomuser.me/api/portraits/women/81.jpg'
        return userImgurl
    })


    const changeUserInfo = () => {
        useRouter().push('/userInfo')
        isShowUserInfo.value = false
    }


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
            .v-navigation-drawer__content{
                height: auto;
            }
        }
    }
</style>