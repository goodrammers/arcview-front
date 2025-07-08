import { defineStore } from 'pinia'
import { useVideo } from '@/composables/Video.ts'
import { computed, ref } from 'vue'

export const useVideoStore = defineStore('video-store', () => {
    const {
        videoEl: video1,
        setOnEndedCallback: setOnEndedCallback1,
        duration: duration1,
        currentTime: currentTime1,
    } = useVideo()
    const {
        videoEl: video2,
        setOnEndedCallback: setOnEndedCallback2,
        duration: duration2,
        currentTime: currentTime2,
    } = useVideo()
    const isPlaying = ref(false)

    // 둘 중, 큰 값을 기준으로 삼는다.
    const currentTime = computed(() =>
        currentTime1.value > currentTime2.value ? currentTime1.value : currentTime2.value
    )

    // 둘 중, 큰 값을 기준으로 삼는다.
    const duration = computed(() =>
        duration1.value > duration2.value ? duration1.value : duration2.value
    )

    function setVideo(index: number, videoUrl: string) {
        const videos = [video1.value, video2.value]
        videos[index]!.src = videoUrl
        videos[index]!.load()
    }

    function togglePlay() {
        if (isPlaying.value) {
            video1.value?.pause()
            video2.value?.pause()
            isPlaying.value = false
        } else {
            video1.value?.play()
            video2.value?.play()
            isPlaying.value = true
        }
    }

    function seek(time: number) {
        video1.value!.currentTime = time
        video2.value!.currentTime = time
    }

    function stop() {
        video1.value!.pause()
        video1.value!.currentTime = 0
        video2.value!.pause()
        video2.value!.currentTime = 0
        isPlaying.value = false
    }

    return {
        video1,
        video2,

        duration,
        isPlaying,
        currentTime,

        togglePlay,
        stop,
        seek,

        setVideo,
    }
})
