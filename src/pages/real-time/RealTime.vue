<template>
    <div class="page-container">
        <div class="content-wrapper">
            <div class="control-card">
                <h2 class="card-title">실시간 보기</h2>
                <div class="selector-grid">
                    <BaseSelect
                        :first-item="{ value: '', label: '작업실 선택' }"
                        :items="booths.map((value) => ({ value: value.id, label: value.name }))"
                        @change="onBoothSelected"
                    ></BaseSelect>
                    <BaseSelect
                        :first-item="{ value: '', label: '카메라 선택' }"
                        :items="cameraSelectors"
                        :disabled="cameraSelectors.length === 0"
                        @change="onCameraSelected"
                    ></BaseSelect>
                </div>
            </div>

            <div class="monitor-card">
                <div
                    ref="videoContainerRef"
                    class="video-container group"
                    :class="{ 'is-fullscreen': isFullScreen }"
                >
                    <video
                        ref="videoEl"
                        muted
                        autoplay
                        class="video-player"
                        :class="videoConnected ? 'is-active' : 'is-hidden'"
                    ></video>

                    <div v-if="!videoConnected" class="no-signal-overlay">
                        <div class="text-center text-gray-400">
                            <div class="icon-circle">
                                <i class="ri-video-off-line text-2xl"></i>
                            </div>
                            <p class="text-lg font-medium mb-2">영상 없음</p>
                        </div>
                    </div>

                    <div v-show="isFullScreen" class="bottom-overlay">
                        <div class="bottom-data-container">
                            <div class="data-item">
                                <span class="label">Current</span>
                                <span class="value">
                                    {{ realtimeData[realtimeData.length - 1]?.current ?? '-' }} A
                                </span>
                            </div>
                            <div class="data-item">
                                <span class="label">Voltage</span>
                                <span class="value">
                                    {{ realtimeData[realtimeData.length - 1]?.voltage ?? '-' }} V
                                </span>
                            </div>
                            <div class="data-item">
                                <span class="label">Speed</span>
                                <span class="value">
                                    {{
                                        realtimeData[realtimeData.length - 1]?.wire_feeding_speed ??
                                        '-'
                                    }}
                                    m/min
                                </span>
                            </div>
                        </div>
                    </div>

                    <button @click="toggleFullscreen" class="btn-fullscreen">
                        <i
                            :class="isFullScreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"
                        ></i>
                    </button>
                </div>

                <div class="data-sidebar" v-if="!isFullScreen">
                    <div class="data-row">
                        <span class="label">current:</span>
                        <span class="value">
                            {{ realtimeData[realtimeData.length - 1]?.current }}
                        </span>
                    </div>
                    <div class="data-row">
                        <span class="label">voltage:</span>
                        <span class="value">
                            {{ realtimeData[realtimeData.length - 1]?.voltage }}
                        </span>
                    </div>
                    <div class="data-row">
                        <span class="label">feeding speed:</span>
                        <span class="value">
                            {{ realtimeData[realtimeData.length - 1]?.wire_feeding_speed }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { getRealtimeBooth, getServerAddress, type RealTimeBoothItem } from '@/api/Realtime.ts'
import { usePlayer } from '@/composables/Player.ts'
import { ResultCode } from '@/api/Types.ts'
import BaseSelect from '@/shared/ui/BaseSelect.vue'

interface RealtimeWelder {
    welder_id: number
    current: number
    timestamp: number
    voltage: number
    wire_feeding_speed: number
}

const videoContainerRef = ref<HTMLDivElement>()
const videoEl = ref<HTMLVideoElement>()
const videoConnected = ref(false)
const isFullScreen = ref(false)
const booths = ref<RealTimeBoothItem[]>([])
const selectedBooth = ref('')
const selectedCamera = ref<{ id: number; name: string; welder_id: number } | undefined>(undefined)
const realtimeData = ref<RealtimeWelder[]>([])
const MAX_DATA_LENGTH = 30
const serverAddress = ref('')

const cameraSelectors = computed(() => {
    const selected = booths.value.find((value) => value.id === +selectedBooth.value)
    if (selected) {
        return selected.cameras.map((value) => ({ value: value.id, label: value.name }))
    }
    return []
})

const { changeCam, setVideoEl } = usePlayer(serverAddress)

const ws = new WebSocket(`${window.location.origin.replace('http', 'ws')}/realtime`)
ws.onmessage = function (event) {
    const data = JSON.parse(event.data) as RealtimeWelder
    if (selectedCamera.value) {
        if (selectedCamera.value.welder_id === data.welder_id) {
            realtimeData.value.push(data)
            if (realtimeData.value.length > MAX_DATA_LENGTH) {
                realtimeData.value.shift()
            }
        }
    }
}

async function toggleFullscreen() {
    if (!videoContainerRef.value) return

    if (!document.fullscreenElement) {
        try {
            await videoContainerRef.value.requestFullscreen()
            isFullScreen.value = true
        } catch (e) {
            console.error('Fullscreen failed:', e)
        }
    } else {
        if (document.exitFullscreen) {
            await document.exitFullscreen()
            isFullScreen.value = false
        }
    }
}

// Sync state on ESC key
function onFullscreenChange() {
    isFullScreen.value = !!document.fullscreenElement
}

function connect() {
    if (!selectedCamera.value) return
    videoConnected.value = true
    const video = videoEl.value
    changeCam(selectedCamera.value.id)
    if (video) setVideoEl(video)
}

function onBoothSelected(e: Event) {
    selectedBooth.value = (e.target as HTMLSelectElement).value
}

function onCameraSelected(e: Event) {
    const cameraId = (e.target as HTMLSelectElement).value
    const booth = booths.value.find((value) => value.id === +selectedBooth.value)
    if (booth) {
        selectedCamera.value = booth.cameras.find((value) => value.id === +cameraId)
    }
}

async function fetchItems() {
    const r = await getRealtimeBooth()
    if (r.code === ResultCode.SUCCESS && r.data) {
        booths.value = r.data
    } else {
        booths.value = []
    }
}

async function fetchAddress() {
    const r = await getServerAddress()
    if (r.code === ResultCode.SUCCESS && r.data) {
        serverAddress.value = r.data.ip
    } else {
        serverAddress.value = ''
    }
}

onMounted(() => {
    document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
})

watch(selectedCamera, () => {
    if (selectedCamera.value) {
        connect()
    }
})
fetchAddress()
fetchItems()
</script>

<style scoped lang="scss">
// Layout Container
.page-container {
    @apply flex-1 overflow-auto;
}

.content-wrapper {
    @apply p-6;
}

// Control Card
.control-card {
    @apply bg-white rounded-lg px-6 py-2 mb-6;
    border: 1px solid #e5e7eb;

    .card-title {
        @apply text-lg font-semibold text-gray-900 mb-4;
    }

    .selector-grid {
        @apply grid grid-cols-1 md:grid-cols-3 gap-4 mb-4;
    }
}

// Monitor Card
.monitor-card {
    @apply bg-white rounded-lg py-6 px-10;
    border: 1px solid #e5e7eb;
    display: flex;
}

// Video Container
.video-container {
    @apply relative bg-black rounded-lg overflow-hidden;
    width: 1000px;
    height: 660px;
    transition: all 0.3s ease;

    &.is-fullscreen {
        width: 100% !important;
        height: 100% !important;
        @apply rounded-none;
        background-color: black;
    }
}

.video-player {
    &.is-active {
        width: 100%;
        height: 100%;
    }

    &.is-hidden {
        width: 0;
        height: 0;
    }

    object-fit: contain;
}

// Overlays
.no-signal-overlay {
    @apply absolute inset-0 flex items-center justify-center;

    .icon-circle {
        @apply w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto;
    }
}

.bottom-overlay {
    @apply absolute bottom-0 left-0 w-full pointer-events-none;
    @apply bg-gradient-to-t from-black/90 via-black/50 to-transparent;
    height: 180px;
    z-index: 10;
    @apply flex items-end justify-center pb-10;
}

.bottom-data-container {
    @apply flex gap-10;

    .data-item {
        @apply flex flex-col items-center;

        .label {
            @apply text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1;
        }

        .value {
            @apply text-white text-3xl font-mono font-bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
    }
}

// Fullscreen Button
.btn-fullscreen {
    @apply absolute bottom-4 right-4 z-20 p-2 rounded-lg text-white transition-all;
    @apply bg-white/20 hover:bg-white/40 backdrop-blur-sm;
    @apply opacity-0 group-hover:opacity-100 focus:opacity-100;

    i {
        @apply text-2xl;
    }
}

// Sidebar Data
.data-sidebar {
    width: 400px;
    margin-left: 20px;
    color: black;
    padding: 20px;

    .data-row {
        @apply mb-2;
    }

    .label {
        @apply mr-2 font-medium;
    }

    .value {
        @apply font-bold;
    }
}
</style>
