import { defineStore } from 'pinia'
import { ref } from 'vue'

interface VideoFileInfo {
    filePath: string
    width: number
    height: number
}

export const useWeldingStore = defineStore('welding', () => {
    const files = ref<VideoFileInfo[]>([
        {
            filePath: '/1080-FCAW_3세대.mp4',
            width: 1920,
            height: 1080,
        },
    ])

    const centerX = ref(0)
    const centerY = ref(0)
    const width = ref(0)
    const height = ref(0)
    function getCropInfo() {
        return {
            centerX: centerX.value,
            centerY: centerY.value,
            width: width.value,
            height: height.value,
        }
    }
    return {
        files,
        centerX,
        centerY,
        width,
        height,

        getCropInfo,
    }
})
