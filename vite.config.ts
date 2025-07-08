import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as fs from 'node:fs'
import path from 'node:path'

function extractJsonServerPort(): string {
    const pkgPath = path.resolve(__dirname, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const script = pkg.scripts?.['json-server'] as string | undefined

    if (!script) return '4000' // 기본값

    const match = script.match(/--port\s+(\d+)/)
    return match?.[1] || '4000'
}
const jsonServerPort = extractJsonServerPort()

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '/api': {
                target: `http://localhost:${jsonServerPort}`,
                changeOrigin: true,
            },
        },
    },
})
