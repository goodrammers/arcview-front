<template>
    <div class="root d-flex align-center pa-2" ref="container">
        <canvas ref="canvasEl"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useVideoToCanvas } from '@/composables/VideoToCanvas.ts'

const props = defineProps<{ videoIndex: number }>()
const { videoIndex } = toRefs(props)
const container = ref()

const { canvasEl, videoEl } = useVideoToCanvas(videoIndex.value, drawFrame)

// canvas.width/height 를 기준으로 하지말고, 비디오의 resolution 을 기준으로 한다.
// 즉, canvas 엘리먼트의 실제 CSS 넓이와 상관없이,
// 데이터 처리를 할 때는 canvas.width 가 아니라, video.videoWidth 를 기준으로 작업한다.
function drawFrame(
    ctx: CanvasRenderingContext2D,
    now: DOMHighResTimeStamp,
    metadata: VideoFrameCallbackMetadata
) {
    const video = videoEl.value
    if (!video) {
        return
    }
    ctx.clearRect(0, 0, metadata.width, metadata.height)
    // const { centerX, centerY, width, height } = getCropInfo()
    // if (width <= 0 || height <= 0) {
    ctx.drawImage(video, 0, 0, metadata.width, metadata.height)
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
