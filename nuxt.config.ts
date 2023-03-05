// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
    ],
    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css',
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
        },
    },
})
