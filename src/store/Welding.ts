import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { fetchVideoMeta } from '@/composables/VideoMeta.ts'

interface VideoFileInfo {
    filePath: string
    width: number
    height: number
    duration: number
}
interface VideoManaged {
    el: HTMLVideoElement
    currentTime: number
    setOnEndedCallback?: (cb: () => void) => void
}
export const useWeldingStore = defineStore('welding', () => {
    const files = ref<VideoFileInfo[]>([
        {
            filePath: '/1080-FCAW_3세대.mp4',
            width: 1920,
            height: 1080,
            duration: 0,
        },
    ])
    const videos = reactive<VideoManaged[]>([])
    const videoEls = ref<HTMLVideoElement[]>([])
    const isPlaying = ref(false)
    const _currentTIme = ref(0)
    const currentTime = computed(() => _currentTIme.value)

    watch(
        videos,
        () => {
            if (videos.length > 0) {
                _currentTIme.value = videos[0].currentTime
            }
        },
        { deep: true }
    )

    function togglePlay() {
        if (isPlaying.value) {
            videoEls.value.forEach((value) => {
                value.pause()
            })
            isPlaying.value = false
        } else {
            videoEls.value.forEach((value) => {
                value.play()
            })
            isPlaying.value = true
        }
    }

    function seek(time: number) {
        videoEls.value.forEach((value) => {
            value.currentTime = time
        })
    }

    function stop() {
        videoEls.value.forEach((value) => {
            value.pause()
            value.currentTime = 0
        })
        isPlaying.value = false
    }

    function addVideo(item: VideoManaged) {
        if (!videos.includes(item)) {
            videos.push(item)
            if (item.setOnEndedCallback) {
                item.setOnEndedCallback(() => {
                    isPlaying.value = false
                })
            }
        }
    }
    function removeVideo(item: VideoManaged) {
        if (videos.includes(item)) {
            videos.push(item)
        }
        const index = videos.findIndex((value) => value === item)
        if (index >= 0) {
            videos.splice(index, 1)
        }
    }

    function addVideoEl(el: HTMLVideoElement) {
        if (!videoEls.value.includes(el)) {
            videoEls.value.push(el)
        }
    }
    function removeVideoEl(el: HTMLVideoElement) {
        const index = videoEls.value.findIndex((value) => value === el)
        if (index >= 0) {
            videoEls.value.splice(index, 1)
        }
    }

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
    // TODO: 인자로 ID를 받아서 해당 정보를 우선 받아온다.
    async function updateWelding() {
        const { duration, videoHeight, videoWidth } = await fetchVideoMeta(files.value[0].filePath)
        files.value[0].duration = duration
        files.value[0].width = videoWidth
        files.value[0].height = videoHeight
    }
    return {
        files,
        centerX,
        centerY,
        width,
        height,
        isPlaying,
        currentTime,

        updateWelding,
        getCropInfo,
        togglePlay,
        stop,
        seek,

        addVideoEl,
        removeVideoEl,

        addVideo,
        removeVideo,
    }
})
