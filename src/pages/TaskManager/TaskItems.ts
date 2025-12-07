import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type BoothResponseItem, getBooths } from '@/api/Booth.ts'
import { ResultCode } from '@/api/Types.ts'

export const useTaskItems = defineStore('task-items', () => {
    const booths = ref<BoothResponseItem[]>([])
    async function fetchBooths() {
        const r = await getBooths()
        if (r.code === ResultCode.SUCCESS && r.data) {
            booths.value = r.data
        } else {
            booths.value = []
        }
    }

    return {
        booths,

        fetchBooths,
    }
})
