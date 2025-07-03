import { ref } from 'vue'
import { useVideo } from '@/composables/Video.ts'

export function useVideoToCanvas(
    drawFrameImpl: (
        ctx: CanvasRenderingContext2D,
        now: DOMHighResTimeStamp,
        metadata: VideoFrameCallbackMetadata
    ) => void
) {
    const { videoEl } = useVideo()
    const canvasEl = ref<HTMLCanvasElement | null>(null)
    let videoWidth = 0
    let videoHeight = 0

    function getContext() {
        return canvasEl.value?.getContext('2d')
    }

    function drawFrame() {
        const ctx = getContext()!
        const video = videoEl.value!
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
        const video = videoEl.value!
        const rect = video.getBoundingClientRect()

        const ctx = canvas.getContext('2d')!
        const dpr = window.devicePixelRatio || 1
        videoWidth = video.videoWidth
        videoHeight = video.videoHeight

        // canvas 의 백스토어 사이즈를 video 의 사이즈와 맞추기
        canvas.width = videoWidth * dpr
        canvas.height = videoHeight * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'

        drawFrame()
    }
    return {
        videoEl,
        canvasEl,

        getContext,
        initCanvas,
    }
}
