<template>
    <div class="view-container video-mode" ref="container">
        <span class="badge" v-if="videoInfo">{{ videoInfo.camera_name }}</span>
        <canvas v-show="hasVideoFile" ref="canvasEl"></canvas>
        <div v-if="videoInfo && !hasVideoFile" class="no-signal">
            <div class="icon-circle"><i class="ri-file-warning-line"></i></div>
            <span>비디오 파일 없음</span>
        </div>
        <div v-else-if="!videoInfo" class="no-signal">
            <div class="icon-circle"><i class="ri-camera-off-line"></i></div>
            <span>카메라 정보 없음</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

const props = defineProps<{ videoIndex: number }>()
const { videoIndex } = toRefs(props)
const container = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)

const weldingStore = useWeldingStore()
const { currentJob, videoElements } = storeToRefs(weldingStore)

const videoInfo = computed(() => {
    if (currentJob.value?.videos && currentJob.value.videos[videoIndex.value]) {
        return currentJob.value.videos[videoIndex.value]
    }
    return null
})

const hasVideoFile = computed(() => !!(videoInfo.value && videoInfo.value.file_path))

let currentVideoEl: HTMLVideoElement | null = null
let resizeObserver: ResizeObserver | null = null

function drawFrame() {
    if (!canvasEl.value || !currentVideoEl) {
        return
    }
    const ctx = canvasEl.value.getContext('2d')
    if (!ctx) {
        return
    }

    const width = canvasEl.value.width
    const height = canvasEl.value.height

    // Clear
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    const vW = currentVideoEl.videoWidth
    const vH = currentVideoEl.videoHeight
    if (vW === 0 || vH === 0) {
        return
    }

    // Letterbox Logic
    const videoAspect = vW / vH
    const canvasAspect = width / height
    let dW = 0,
        dH = 0,
        offsetX = 0,
        offsetY = 0

    if (videoAspect > canvasAspect) {
        dW = width
        dH = width / videoAspect
        offsetY = (height - dH) / 2
    } else {
        dH = height
        dW = height * videoAspect
        offsetX = (width - dW) / 2
    }

    ctx.drawImage(currentVideoEl, 0, 0, vW, vH, offsetX, offsetY, dW, dH)
}

function onFrame() {
    drawFrame()
    if (currentVideoEl && !currentVideoEl.paused) {
        currentVideoEl.requestVideoFrameCallback(onFrame)
    }
}

function onPlay() {
    if (currentVideoEl) {
        currentVideoEl.requestVideoFrameCallback(onFrame)
    }
}

function onSeeked() {
    drawFrame()
}

function updateCanvasSize() {
    if (!container.value || !canvasEl.value) {
        return
    }
    const dpr = window.devicePixelRatio || 1
    canvasEl.value.width = container.value.clientWidth * dpr
    canvasEl.value.height = container.value.clientHeight * dpr
    drawFrame()
}

// Watch Video Element
watch(
    [() => videoElements.value[videoIndex.value], hasVideoFile],
    ([newEl, hasFile], [oldEl]) => {
        // Cleanup Old
        if (oldEl) {
            oldEl.removeEventListener('play', onPlay)
            oldEl.removeEventListener('seeked', onSeeked)
        }

        // Setup New
        if (hasFile && newEl) {
            currentVideoEl = newEl
            currentVideoEl.addEventListener('play', onPlay)
            currentVideoEl.addEventListener('seeked', onSeeked)

            if (!currentVideoEl.paused) {
                currentVideoEl.requestVideoFrameCallback(onFrame)
            } else if (currentVideoEl.readyState >= 2) {
                drawFrame()
            } else {
                currentVideoEl.addEventListener('loadeddata', drawFrame, { once: true })
            }
        } else {
            currentVideoEl = null
            if (canvasEl.value) {
                const ctx = canvasEl.value.getContext('2d')
                if (ctx) ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height)
            }
        }
    },
    { immediate: true }
)

onMounted(() => {
    if (container.value) {
        resizeObserver = new ResizeObserver(() => updateCanvasSize())
        resizeObserver.observe(container.value)
    }
})

onBeforeUnmount(() => {
    if (resizeObserver) resizeObserver.disconnect()
    if (currentVideoEl) {
        currentVideoEl.removeEventListener('play', onPlay)
        currentVideoEl.removeEventListener('seeked', onSeeked)
    }
})
</script>

<style scoped lang="scss">
.view-container {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #0f172a;
}
.video-mode {
    background-color: #000;
}
.badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(30, 41, 59, 0.8);
    color: #fff;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 10;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-weight: 500;
    backdrop-filter: blur(2px);
}
canvas {
    display: block;
    width: 100%;
    height: 100%;
}
.no-signal {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #64748b;
    gap: 12px;
    .icon-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
        i {
            font-size: 28px;
            color: #475569;
        }
    }
    span {
        font-size: 13px;
        font-weight: 500;
    }
}
</style>
