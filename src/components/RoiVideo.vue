<template>
    <div class="roi-container d-flex align-center" ref="container">
        <video
            ref="videoEl"
            @loadeddata="initCanvas"
            controls
            autoplay
            muted
            draggable="false"
            :src="videoSrc"
        ></video>
        <canvas ref="canvasEl"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWeldingStore } from '@/store/Welding.ts'
import { storeToRefs } from 'pinia'
import { useVideoToCanvas } from '@/composables/VideoToCanvas.ts'

const { files } = storeToRefs(useWeldingStore())
const { getCropInfo } = useWeldingStore()
const videoSrc = ref(files.value[0].filePath)
const container = ref()

const { videoEl, canvasEl, initCanvas } = useVideoToCanvas(drawFrame)

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
