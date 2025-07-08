import { onBeforeMount, onMounted, ref } from 'vue'

export function useVideo() {
    const videoEl = ref<HTMLVideoElement | null>(null)
    const isPlaying = ref(false)
    const duration = ref(0)
    const currentTime = ref(0)
    let onEndedCallback: null | (() => void) = null

    function initValue() {
        const video = videoEl.value
        if (!video) {
            return
        }
        duration.value = video.duration

        const w = video.videoWidth
        const h = video.videoHeight
        video.style.aspectRatio = `${w} / ${h}`
    }

    function setOnEndedCallback(cb: () => void) {
        onEndedCallback = cb
    }

    function onEnded() {
        isPlaying.value = false
        if (onEndedCallback) {
            onEndedCallback()
        }
    }

    function updateCurrentTime() {
        currentTime.value = videoEl.value!.currentTime
    }

    onMounted(() => {
        if (videoEl.value) {
            videoEl.value.addEventListener('loadedmetadata', initValue)
            videoEl.value.addEventListener('ended', onEnded)
            videoEl.value.addEventListener('timeupdate', updateCurrentTime)
        }
    })
    onBeforeMount(() => {
        if (videoEl.value) {
            videoEl.value.removeEventListener('loadedmetadata', initValue)
            videoEl.value.removeEventListener('ended', onEnded)
            videoEl.value.removeEventListener('timeupdate', updateCurrentTime)
        }
    })

    return {
        videoEl,
        currentTime,
        duration,
        setOnEndedCallback,
    }
}
