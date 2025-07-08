import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useVideoStore } from '@/store/Video.ts'

export interface WeldingCropItem {
    time: number
    center: [number, number]
}

export interface WeldingVideoFile {
    url: string
    crop: WeldingCropItem[]
}

export interface WeldingItem {
    id: string
    file1: WeldingVideoFile
    file2: WeldingVideoFile
}

export const useWeldingStore = defineStore('welding', () => {
    const currentItem = ref<WeldingItem | null>(null)

    async function updateWelding(id: string) {
        try {
            const response = await axios.get(`/api/weldings/${id}`)
            currentItem.value = response.data as WeldingItem
            const { setVideo } = useVideoStore()
            setVideo(0, currentItem.value.file1.url)
            setVideo(1, currentItem.value.file2.url)
        } catch (error) {
            throw error
        }
    }
    return {
        currentItem,

        updateWelding,
    }
})
