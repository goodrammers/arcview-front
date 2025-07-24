import { onBeforeUnmount, onMounted, type Ref, ref, watch } from 'vue'
import { useVideoStore } from '@/store/Video.ts'
import { storeToRefs } from 'pinia'
import { debounce } from '@/Utils/Debounce.ts'

export function useVideoToCanvas(
    index: Ref<number>,
    drawFrameImpl: (
        captured: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => void
) {
    const { captured1, captured2 } = storeToRefs(useVideoStore())
    const { getResolution1, getResolution2, capturedCanvas1, capturedCanvas2 } = useVideoStore()
    const canvasEl = ref<HTMLCanvasElement | null>(null)
    let videoWidth = 0
    let videoHeight = 0
    let stopWatch: null | ReturnType<typeof watch> = null
    let resizeObserver: ResizeObserver | null = null

    function getCapturedCanvas(): HTMLCanvasElement {
        return [capturedCanvas1, capturedCanvas2][index.value] as unknown as HTMLCanvasElement
    }

    function getResolution() {
        return [getResolution1, getResolution2][index.value]()
    }

    function getContext() {
        return canvasEl.value?.getContext('2d')
    }
    function getWatch() {
        return [captured1, captured2][index.value]
    }

    function drawFrame() {
        const capture = getCapturedCanvas()
        const toWatch = getWatch()
        if (stopWatch) {
            stopWatch()
        }

        stopWatch = watch(
            toWatch,
            () => {
                drawFrameImpl(capture, getContext()!, videoWidth, videoHeight)
            },
            { immediate: true }
        )
    }

    function initCanvas() {
        const canvas = canvasEl.value!
        const ctx = canvas.getContext('2d')!

        const dpr = window.devicePixelRatio || 1
        const { width, height } = getResolution()
        videoWidth = width
        videoHeight = height
        // canvas 의 백스토어 사이즈를 video 의 사이즈와 맞추기
        canvas.width = videoWidth * dpr
        canvas.height = videoHeight * dpr
        ctx.scale(dpr, dpr)

        drawFrame()
    }

    onMounted(() => {
        if (canvasEl.value) {
            const debouncedDraw = debounce(drawFrame, 100)

            resizeObserver = new ResizeObserver(() => {
                debouncedDraw()
            })
            resizeObserver.observe(canvasEl.value)
        }
    })

    onBeforeUnmount(() => {
        if (stopWatch) {
            stopWatch()
        }
        if (resizeObserver && canvasEl.value) {
            resizeObserver.unobserve(canvasEl.value)
        }
    })

    return {
        canvasEl,
        initCanvas,
        getContext,
    }
}
