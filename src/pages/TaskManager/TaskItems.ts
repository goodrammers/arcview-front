import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type BoothResponseItem, getBooths } from '@/api/Booth.ts'
import { ResultCode } from '@/api/Types.ts'
import { getWelders, type Welder } from '@/api/Welder.ts'

export const useTaskItems = defineStore('task-items', () => {
    const booths = ref<BoothResponseItem[]>([])
    const welders = ref<Welder[]>([])
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

    return {
        booths,
        welders,

        fetchBooths,
        fetchWelders,
    }
})
