<template>
    <div class="root d-flex align-center pa-2" ref="container">
        <canvas ref="canvasEl"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import { useVideoToCanvas } from '@/composables/VideoToCanvas.ts'

const props = defineProps<{ videoIndex: number; isRoi: boolean }>()
const { videoIndex, isRoi } = toRefs(props)
const container = ref()
const { canvasEl, initCanvas } = useVideoToCanvas(videoIndex, drawFrame)
let stopWatch: ReturnType<typeof watch> | null = null

// canvas.width/height 를 기준으로 하지말고, 비디오의 resolution 을 기준으로 한다.
// 즉, canvas 엘리먼트의 실제 CSS 넓이와 상관없이,
// 데이터 처리를 할 때는 canvas.width 가 아니라, video.videoWidth 를 기준으로 작업한다.
function drawFrame(
    captured: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    videoWidth: number,
    videoHeight: number
) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const videoAspect = videoWidth / videoHeight
    const canvasWidth = ctx.canvas.clientWidth
    const canvasHeight = ctx.canvas.clientHeight
    const canvasAspect = canvasWidth / canvasHeight

    let drawWidth = 0
    let drawHeight = 0
    let offsetX = 0
    let offsetY = 0

    if (videoAspect > canvasAspect) {
        // 비디오 width 가 캔버스의 width 보다 큰 경우
        // 너비 기준으로 맞추고, 높이는 축소
        drawWidth = videoWidth

        // 실제 canvas element 기준 높이
        const h = canvasWidth / videoAspect
        // canvas 좌표계로 맞추기
        const ratio = videoHeight / canvasHeight
        drawHeight = h * ratio

        offsetY = (videoHeight - drawHeight) / 2
    } else {
        // 비디오 height 가 캔버스의 height 보다 큰 경우
        // 높이 기준으로 맞추고, 너비는 축소
        drawHeight = videoHeight

        // 실제 canvas element 기준 너비
        const w = canvasHeight * videoAspect
        // canvas 좌표계로 맞추기
        const ratio = videoWidth / canvasWidth
        drawWidth = w * ratio

        offsetX = (videoWidth - drawWidth) / 2
    }
    // console.log(offsetX, offsetY, drawWidth, drawHeight)
    // ctx.drawImage(captured, offsetX, offsetY, drawWidth, drawHeight)
    ctx.drawImage(captured, 0, 0, videoWidth, videoHeight, offsetX, offsetY, drawWidth, drawHeight)
    // console.log(offsetX, offsetY, drawWidth, drawHeight)

    // const { centerX, centerY, width, height } = getCropInfo()
    // if (width <= 0 || height <= 0) {
    // ctx.drawImage(captured, 0, 0, width, height)
    // } else {
    //     ctx.drawImage(
    //         video,
    //         centerX - width / 2,
    //         centerY - height / 2,
    //         width,
    //         height,
    //         0,
    //         0,
    //         metadata.width,
    //         metadata.height
    //     )
    // }
}

onMounted(() => {
    stopWatch = watch(
        videoIndex,
        () => {
            if (videoIndex.value === 0 || videoIndex.value === 1) {
                initCanvas()
            }
        },
        { immediate: true }
    )
})
onBeforeUnmount(() => {
    if (stopWatch) {
        stopWatch()
        stopWatch = null
    }
})
</script>

<style lang="scss" scoped>
.root {
    width: 100%;
    height: 100%;
    position: relative;

    canvas {
        display: inline-block;
        width: 100%;
        height: 100%;
        z-index: 1;
    }
}
</style>
