import { onBeforeMount, onMounted, ref } from 'vue'

// video 를 가져다 쓰는 곳에서 직접  requestVideoFrameCallback 를 호출하여 사용하는 경우,
// 정지된 상태에서는   requestVideoFrameCallback 에 의해 호출되지 않는 경우가 발생할 수 있음
// 따라서, video 를 숨겨진 캔버스에 일단 캡쳐 해놓고, video 데이터가 필요한 경우 캡쳐된 캔버스를 사용한다.
export function useVideo(canvasToCapture: HTMLCanvasElement | null = null) {
    const videoEl = ref<HTMLVideoElement | null>(null)
    const duration = ref(0)
    const currentTime = ref(0)
    const captured = ref(0)
    let onEndedCallback: null | (() => void) = null

    let videoWidth = 0
    let videoHeight = 0

    function initValue() {
        const video = videoEl.value
        if (!video) {
            return
        }
        duration.value = video.duration

        videoWidth = video.videoWidth
        videoHeight = video.videoHeight
        video.style.aspectRatio = `${videoWidth} / ${videoHeight}`

        if (canvasToCapture) {
            // canvas 의 백스토어 사이즈를 video 의 사이즈와 맞추기
            const dpr = window.devicePixelRatio || 1
            canvasToCapture.width = videoWidth * dpr
            canvasToCapture.height = videoHeight * dpr
            const ctx = canvasToCapture.getContext('2d')
            ctx!.scale(dpr, dpr)
        }
    }

    function setOnEndedCallback(cb: () => void) {
        onEndedCallback = cb
    }

    function onEnded() {
        if (onEndedCallback) {
            onEndedCallback()
        }
    }

    function updateCurrentTime() {
        currentTime.value = videoEl.value!.currentTime
    }

    function captureFrame() {
        if (!canvasToCapture) {
            return
        }
        const video = videoEl.value
        if (!video) {
            return
        }
        function loop() {
            const ctx = canvasToCapture!.getContext('2d')
            ctx!.drawImage(video!, 0, 0, videoWidth, videoHeight)
            captured.value++
            video!.requestVideoFrameCallback(loop)
        }
        video.requestVideoFrameCallback(loop)
    }

    function getResolution() {
        return { width: videoWidth, height: videoHeight }
    }

    onMounted(() => {
        if (videoEl.value) {
            videoEl.value.addEventListener('loadedmetadata', initValue)
            videoEl.value.addEventListener('ended', onEnded)
            videoEl.value.addEventListener('timeupdate', updateCurrentTime)
            captureFrame()
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
        captured,

        setOnEndedCallback,
        getResolution,
    }
}
