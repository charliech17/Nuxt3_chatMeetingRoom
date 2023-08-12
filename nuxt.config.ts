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
    vite: {
    define: {
        "process.env.TESS_ENV": process.env.ENV,
    },
    },
    ssr: false,
    runtimeConfig: {},
})
