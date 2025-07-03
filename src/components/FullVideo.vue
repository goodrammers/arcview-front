<template>
    <div class="video-container d-flex align-center" draggable="false" ref="rootEl">
        <video ref="videoEl" autoplay muted draggable="false" :src="videoSrc"></video>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVideo } from '@/composables/Video.ts'
import { useWeldingStore } from '@/store/Welding.ts'
import { useDragRect } from '@/composables/DragRect.ts'

const { files, centerX, centerY, width, height } = storeToRefs(useWeldingStore())
const { videoEl } = useVideo()
const videoSrc = ref(files.value[0].filePath)
const { el: rootEl, setCustomMouseUp, rect } = useDragRect()

setCustomMouseUp(() => {
    const video = videoEl.value
    if (!video) {
        return
    }
    const videoRect = video.getBoundingClientRect()
    const xRatio = video.videoWidth / videoRect.width
    const yRatio = video.videoHeight / videoRect.height

    const _width = rect.value.width
    const _height = rect.value.height
    const _centerX = rect.value.left + _width / 2
    const _centerY = rect.value.top + _height / 2
    width.value = _width * xRatio
    height.value = _height * yRatio
    centerX.value = _centerX * xRatio
    centerY.value = _centerY * yRatio
})
</script>

<style lang="scss" scoped>
.video-container {
    width: 100%;
    height: 100%;
    user-select: none;

    video {
        width: 100%;
        display: inline-block;
        object-fit: contain;
        pointer-events: none;
        user-select: none;
    }
}
</style>
