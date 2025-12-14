import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type BoothResponseItem, getBooths } from '@/api/Booth.ts'
import { ResultCode } from '@/api/Types.ts'
import { getWelders, type Welder } from '@/api/Welder.ts'
import type { Camera } from '@/api/Camera.ts'
import { getCameras } from '@/api/Camera.ts'

export const useTaskItems = defineStore('task-items', () => {
    const booths = ref<BoothResponseItem[]>([])
    const welders = ref<Welder[]>([])
    const cameras = ref<Camera[]>([])
    async function fetchBooths() {
        const r = await getBooths()
        if (r.code === ResultCode.SUCCESS && r.data) {
            booths.value = r.data
        } else {
            booths.value = []
        }
    }
    async function fetchWelders() {
        const r = await getWelders()
        if (r.code === ResultCode.SUCCESS && r.data) {
            welders.value = r.data
        } else {
            booths.value = []
        }
    }
    async function fetchCameras() {
        const r = await getCameras()
        if (r.code === ResultCode.SUCCESS && r.data) {
            cameras.value = r.data
        } else {
            cameras.value = []
        }
    }

    return {
        booths,
        welders,
        cameras,

        fetchBooths,
        fetchWelders,
        fetchCameras,
    }
})
