// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify';

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        ['unplugin-icons/nuxt', { /* options */ }],
        async (options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
              config?.plugins?.push(vuetify());
           });
        }
    ],
    css: [
        'vuetify/lib/styles/main.sass',
    ],
    build: {
        transpile: ['vuetify'],
    },
    ssr: false,
    runtimeConfig: {
        public: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY, 
            FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN, 
            FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL, 
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID, 
            FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET, 
            FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID, 
            FIREBASE_APP_ID: process.env.FIREBASE_APP_ID, 
            FIREBASE_RTDB_KEY: process.env.FIREBASE_RTDB_KEY, 
            SOCKET_CONNECTION_URL: process.env.SOCKET_CONNECTION_URL
        },
    },
})
