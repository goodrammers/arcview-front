import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useVideoStore } from '@/store/Video.ts'
import { storeToRefs } from 'pinia'

export function useVideoToCanvas(
    index: number,
    drawFrameImpl: (
        ctx: CanvasRenderingContext2D,
        now: DOMHighResTimeStamp,
        metadata: VideoFrameCallbackMetadata
    ) => void
) {
    const { video1, video2 } = storeToRefs(useVideoStore())
    const selectedVideo = computed(() => [video1.value, video2.value][index])
    const canvasEl = ref<HTMLCanvasElement | null>(null)
    let videoWidth = 0
    let videoHeight = 0

    function getContext() {
        return canvasEl.value?.getContext('2d')
    }

    function drawFrame() {
        const ctx = getContext()!
        const video = selectedVideo.value!
        function loop(now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) {
            drawFrameImpl(ctx, now, metadata)

            // 루프
            video.requestVideoFrameCallback(loop)
        }
        video.requestVideoFrameCallback((now, metadata) => {
            loop(now, metadata)
        })
    }

    function initCanvas() {
        const canvas = canvasEl.value!
        const video = selectedVideo.value!
        const ctx = canvas.getContext('2d')!
        const dpr = window.devicePixelRatio || 1
        videoWidth = video.videoWidth
        videoHeight = video.videoHeight

        // canvas 의 백스토어 사이즈를 video 의 사이즈와 맞추기
        canvas.width = videoWidth * dpr
        canvas.height = videoHeight * dpr
        ctx.scale(dpr, dpr)

        drawFrame()
    }

    onMounted(() => {
        selectedVideo.value?.addEventListener('loadeddata', initCanvas)
    })
    onBeforeUnmount(() => {
        selectedVideo.value?.removeEventListener('loadeddata', initCanvas)
    })

    return {
        canvasEl,
        videoEl: selectedVideo,

        getContext,
    }
}
