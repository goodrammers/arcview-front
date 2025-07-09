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
    width: number,
    height: number
) {
    ctx.clearRect(0, 0, width, height)
    // const { centerX, centerY, width, height } = getCropInfo()
    // if (width <= 0 || height <= 0) {
    ctx.drawImage(captured, 0, 0, width, height)
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
