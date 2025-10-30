import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from '@/router'

import './assets/style/main.scss'
import 'remixicon/fonts/remixicon.css'

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
})

createApp(App).use(vuetify).use(createPinia()).use(router).mount('#app')
