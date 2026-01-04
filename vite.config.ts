import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// const ipAddress = '39.115.174.184:5050'
// const ipAddress = '192.168.0.77:5050'
const ipAddress = 'localhost:5050'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3200,
        proxy: {
            '/api': {
                target: `http://${ipAddress}`,
            },
            '/videos': {
                target: `http://${ipAddress}`,
            },
            '/realtime': {
                target: `ws://${ipAddress}`,
                ws: true,
            },
        },
    },
})
