<template>
    <div class="roi-container d-flex align-center" ref="container">
        <video
            ref="videoEl"
            @loadeddata="initCanvas"
            controls
            muted
            draggable="false"
            :src="videoSrc"
        ></video>
        <canvas ref="canvasEl"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWeldingStore } from '@/store/Welding.ts'
import { storeToRefs } from 'pinia'
import { useVideoToCanvas } from '@/composables/VideoToCanvas.ts'

const { files } = storeToRefs(useWeldingStore())
const { getCropInfo } = useWeldingStore()
const videoSrc = ref(files.value[0].filePath)
const container = ref()

const { videoEl, canvasEl, initCanvas } = useVideoToCanvas(drawFrame)

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
    const { centerX, centerY, width, height } = getCropInfo()
    if (width <= 0 || height <= 0) {
        ctx.drawImage(video, 0, 0, metadata.width, metadata.height)
    } else {
        ctx.drawImage(
            video,
            centerX - width / 2,
            centerY - height / 2,
            width,
            height,
            0,
            0,
            metadata.width,
            metadata.height
        )
    }
}

onMounted(() => {
    if (videoEl.value) {
        useWeldingStore().addVideoEl(videoEl.value)
    }
})
</script>

<style lang="scss" scoped>
.roi-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: #eee;

    video {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        display: inline-block;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
        z-index: -1;
    }
    canvas {
        display: inline-block;
        width: 100%;
        z-index: 1;
    }
}
</style>
