<template>
    <div>
        <v-layout class="headerSection">
        <!-- header條 -->
            <v-app-bar 
                class="position-static text-white" 
                :color="use_deviceInfo_Store().systemColorChange ? '#5f9ea0' : '#07304e'"
            >
                <template 
                    v-if="use_deviceInfo_Store().isMobile"
                    v-slot:prepend 
                >
                    <v-app-bar-nav-icon :icon="headerMdiIcons.mdiMenu" @click="isShowDrawer = !isShowDrawer"></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title 
                    class="md:ml-3"
                    @click="navigateTo('/')"
                >
                    chatApp
                </v-app-bar-title>
                <template v-slot:append>
                    <div
                        v-if="!use_deviceInfo_Store().isMobile"
                        class="mr-3 md:block"
                    >
                        <NavItems
                            @changeShowDrawer="(isShow) => isShowDrawer = isShow"
                        />
                    </div>
                    <div>
                        <v-btn 
                            :icon="headerMdiIcons.mdiAccountCircle" 
                            @click="isShowUserInfo = !isShowUserInfo" 
                            v-if="isLogin"
                        />
                        <v-btn 
                            v-else
                            variant="tonal" 
                            class="bg-deep-purple-lighten-5 deep-purple-darken-4" 
                            @click="navigateTo('/login')"
                        >
                            登入
                        </v-btn>
                    </div>
                </template>
            </v-app-bar>
            <!-- 手機版漢堡展開選單 -->
            <v-navigation-drawer
                class="menu_drawer"
                v-model="isShowDrawer"
                location="top"
                temporary
                :absolute="true"
            >
                <NavItems
                    @changeShowDrawer="(isShow) => isShowDrawer = isShow"
                />
            </v-navigation-drawer>
            <!-- 登入資訊選單 -->
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
                    <v-list-item :prepend-icon="headerMdiIcons.mdiHomeCity" title="首頁" value="home" @click="handleBackHome"/>
                    <v-list-item :prepend-icon="headerMdiIcons.mdiAccount" title="更改資訊" value="account" @click="changeUserInfo"/>
                    <v-list-item :prepend-icon="headerMdiIcons.mdiLogout" title="登出" value="logout" @click="logoutUser"/>
                </v-list>
            </v-navigation-drawer>
        </v-layout>
        <div class="userInfoDrawer">
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/authStore'
import { use_deviceInfo_Store } from '@/stores/deviceInfoStore'
import { signOutUser } from '@/utils/firebase/auth'
import { headerMdiIcons } from '@/utils/icons/HeaderIconUtils'
import NavItems from "@/components/base/NavItems.vue"
    
const isShowDrawer    = ref(false)
const isShowUserInfo  = ref(false)
const isLogin         = computed(() => useAuthStore().isAuth)
const userName = computed(()=> {
    const getUserName = useAuthStore().displayName
    return getUserName ? getUserName : ''
})
const userImg = computed(()=> {
    const saveURL = useAuthStore().photoURL
    const userImgurl = saveURL ? saveURL : 'https://randomuser.me/api/portraits/women/81.jpg'
    return userImgurl
})

const handleBackHome = () => {
    console.log(useRoute().path,'path')
    if(useRoute().path === '/') {
        console.log('isHome')
        isShowDrawer.value = false
    } else {
        navigateTo('/');
        isShowDrawer.value = false
    }
}


const changeUserInfo = () => {
    navigateTo('/userInfo')
    isShowUserInfo.value = false
}


const logoutUser = async () => {
    await signOutUser()
    isShowUserInfo.value = false
    useRouter().replace('/')
}

</script>

<style lang="scss">
    .lightColor{
        background: white;
        color: #6A1B9A;
        font-weight: 800;

        button{
            background: rgb(131, 47, 16);
            color: white;
            font-weight: 900;
            &:hover{
                background-color: antiquewhite;
                color: black !important;
            }
        }

        .cover_bg{
            background: linear-gradient(#e9d2c4,#EDE7F6,#ceb299,#f5eae5);
        }
    }
</style>

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

        :deep(.menu_drawer) {
            .clickEffect {
                &:hover,
                &:active{
                    background: #EDE7F6;
                    color: #4527A0;
                }
            }
        }
    }
</style>