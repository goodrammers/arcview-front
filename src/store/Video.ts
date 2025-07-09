import { defineStore } from 'pinia'
import { useVideo } from '@/composables/Video.ts'
import { computed, ref, watch } from 'vue'

export const useVideoStore = defineStore('video-store', () => {
    const capturedCanvas1 = document.createElement('canvas')
    const capturedCanvas2 = document.createElement('canvas')

    const {
        videoEl: video1,
        setOnEndedCallback: setOnEndedCallback1,
        duration: duration1,
        currentTime: currentTime1,
        captured: captured1,
        getResolution: getResolution1,
    } = useVideo(capturedCanvas1)
    const {
        videoEl: video2,
        setOnEndedCallback: setOnEndedCallback2,
        duration: duration2,
        currentTime: currentTime2,
        captured: captured2,
        getResolution: getResolution2,
    } = useVideo(capturedCanvas2)
    const isPlaying1 = ref(false)
    const isPlaying2 = ref(false)
    const isPlaying = ref(false)

    setOnEndedCallback1(() => {
        isPlaying1.value = false
    })
    setOnEndedCallback2(() => {
        isPlaying2.value = false
    })

    // 둘 중, 큰 값을 기준으로 삼는다.
    const currentTime = computed(() =>
        currentTime1.value > currentTime2.value ? currentTime1.value : currentTime2.value
    )

    // 둘 중, 큰 값을 기준으로 삼는다.
    const duration = computed(() =>
        duration1.value > duration2.value ? duration1.value : duration2.value
    )

    watch([isPlaying1, isPlaying2], () => {
        // 하나라도 play 중이면 play 중으로 결정
        isPlaying.value = isPlaying1.value || isPlaying2.value
    })

    function setVideo(index: number, videoUrl: string) {
        const videos = [video1.value, video2.value]
        videos[index]!.src = videoUrl
        videos[index]!.load()
    }

    function togglePlay() {
        if (isPlaying.value) {
            video1.value?.pause()
            video2.value?.pause()
            isPlaying1.value = false
            isPlaying2.value = false
        } else {
            video1.value?.play()
            video2.value?.play()
            isPlaying1.value = true
            isPlaying2.value = true
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
        isPlaying1.value = false
        isPlaying2.value = false
    }

    return {
        // video1, video2 는 실제 <video>의 ref 를 위해서만 사용
        // TODO: 이 함수안에서 코드로 생성하기
        video1,
        video2,

        capturedCanvas1,
        capturedCanvas2,
        captured1,
        captured2,

        duration,
        isPlaying,
        currentTime,

        togglePlay,
        stop,
        seek,
        getResolution1,
        getResolution2,
        setVideo,
    }
})
