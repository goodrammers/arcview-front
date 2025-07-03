import { onBeforeMount, onMounted, ref } from 'vue'

export function useVideo() {
    const videoEl = ref<HTMLVideoElement | null>(null)

    function setRatio() {
        const video = videoEl.value
        if (!video) {
            return
        }
        const w = video.videoWidth
        const h = video.videoHeight
        video.style.aspectRatio = `${w} / ${h}`
    }

    onMounted(() => {
        if (videoEl.value) {
            videoEl.value.addEventListener('loadedmetadata', setRatio)
        }
    })
    onBeforeMount(() => {
        if (videoEl.value) {
            videoEl.value.removeEventListener('loadedmetadata', setRatio)
        }
    })

    return {
        videoEl,
        setRatio,
    }
}
