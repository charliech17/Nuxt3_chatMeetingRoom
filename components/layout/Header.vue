<template>
    <div>
        <v-layout class="headerSection">
            <v-app-bar 
                class="position-static" 
                :class="use_deviceInfo_Store().systemColorChange ? 'text-white' : ''" 
                :color="use_deviceInfo_Store().systemColorChange ? '#5f9ea0' : 'primary'"
            >
                <template v-slot:prepend>
                    <v-app-bar-nav-icon :icon="headerMdiIcons.mdiMenu" @click="isShowDrawer = !isShowDrawer"></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title @click="navigateTo('/')">
                    chatApp
                </v-app-bar-title>
                <template v-slot:append>
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
                </template>
            </v-app-bar>
            <v-navigation-drawer
                class="menu_drawer"
                v-model="isShowDrawer"
                location="top"
                temporary
                :absolute="true"
            >
                <v-list-item class="py-5 clickEffect" :prepend-icon="headerMdiIcons.mdiBookEducationOutline" title="切換色系" value="education" @click="()=>handleMenuDraweItems('changeColor')"/>
                <v-list-item class="py-5 clickEffect" :prepend-icon="headerMdiIcons.mdiAccountGroup" title="前往會議資訊" value="room" @click="()=>handleMenuDraweItems('room')"/>
                <v-list-item class="py-5 clickEffect" :prepend-icon="headerMdiIcons.mdiBookEducationOutline" title="前往使用說明" value="education" @click="()=>handleMenuDraweItems('education')"/>
                <v-list-item class="py-5 clickEffect" :prepend-icon="headerMdiIcons.mdiCurrencyUsd" title="贊助" value="sponser" @click="()=>handleMenuDraweItems('sponser')"/>
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


    const handleMenuDraweItems = async (triggerItems: 'room' | 'education' | 'sponser' | 'changeColor' ) => {
        switch(triggerItems) {
            case 'changeColor':
                use_deviceInfo_Store().changeSystemColor()
                isShowDrawer.value = false
                break
            case 'room' :
                navigateTo('/room')
                isShowDrawer.value = false
                break
            case 'education':
                isShowDrawer.value = false
                // TODO 導至教學頁面
                alert('敬請期待')
                break
            case 'sponser':
                isShowDrawer.value = false
                navigateTo('/donation')
                break
        }
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