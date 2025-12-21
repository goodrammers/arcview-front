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

                    <div v-show="isFullScreen && videoConnected" class="fullscreen-text-overlay">
                        <div class="data-box">
                            <div class="overlay-row">
                                <span class="label">Current:</span>
                                <span class="value">{{ currentVal }} A</span>
                            </div>
                            <div class="overlay-row">
                                <span class="label">Voltage:</span>
                                <span class="value">{{ voltageVal }} V</span>
                            </div>
                            <div class="overlay-row">
                                <span class="label">Resistance:</span>
                                <span class="value">{{ resistance }} mΩ</span>
                            </div>
                            <div class="overlay-row">
                                <span class="label">Speed:</span>
                                <span class="value">{{ speedVal }} m/min</span>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="isFullScreen && videoConnected"
                        class="fullscreen-chart-overlay group/chart"
                    >
                        <div class="chart-controls-overlay">
                            <label
                                v-for="opt in metricOptions"
                                :key="opt.key"
                                class="metric-checkbox-overlay"
                                :class="{ 'is-active': selectedMetrics.includes(opt.key) }"
                                :style="{ '--active-color': opt.color }"
                            >
                                <input
                                    type="checkbox"
                                    :value="opt.key"
                                    :checked="selectedMetrics.includes(opt.key)"
                                    @change="onMetricChange(opt.key)"
                                    class="hidden"
                                />
                                <span class="dot" :style="{ backgroundColor: opt.color }"></span>
                                {{ opt.label }}
                            </label>
                        </div>

                        <div class="canvas-wrapper">
                            <canvas ref="chartCanvasRef"></canvas>
                        </div>
                    </div>

                    <button @click="toggleFullscreen" class="btn-fullscreen">
                        <i
                            :class="isFullScreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"
                        ></i>
                    </button>
                </div>

                <div class="data-sidebar" v-if="!isFullScreen">
                    <div class="chart-controls">
                        <label
                            v-for="opt in metricOptions"
                            :key="opt.key"
                            class="metric-checkbox"
                            :class="{ 'is-active': selectedMetrics.includes(opt.key) }"
                        >
                            <input
                                type="checkbox"
                                :value="opt.key"
                                :checked="selectedMetrics.includes(opt.key)"
                                @change="onMetricChange(opt.key)"
                                class="hidden"
                            />
                            <span class="dot" :style="{ backgroundColor: opt.color }"></span>
                            {{ opt.label }}
                        </label>
                    </div>

                    <div class="chart-wrapper">
                        <canvas ref="chartCanvasRef"></canvas>
                    </div>

                    <div class="current-values">
                        <div class="mini-stat">
                            <span class="lbl">A:</span>
                            {{ currentVal }}
                        </div>
                        <div class="mini-stat">
                            <span class="lbl">V:</span>
                            {{ voltageVal }}
                        </div>
                        <div class="mini-stat">
                            <span class="lbl">Ω:</span>
                            {{ resistance }}
                        </div>
                        <div class="mini-stat">
                            <span class="lbl">S:</span>
                            {{ speedVal }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getRealtimeBooth, getServerAddress, type RealTimeBoothItem } from '@/api/Realtime.ts'
import { usePlayer } from '@/composables/Player.ts'
import { ResultCode } from '@/api/Types.ts'
import BaseSelect from '@/shared/ui/BaseSelect.vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'

Chart.register(...registerables)

interface RealtimeWelder {
    welder_id: number
    current: number
    timestamp: number
    voltage: number
    wire_feeding_speed: number
}
interface RealtimeWelderWithR extends RealtimeWelder {
    resistance: number
}

// Chart Options (Y축 고정)
const metricOptions = [
    { key: 'current', label: '전류 (A)', color: 'rgb(255, 99, 132)', min: 0, max: 500 },
    { key: 'voltage', label: '전압 (V)', color: 'rgb(53, 162, 235)', min: 0, max: 60 },
    {
        key: 'resistance',
        label: '저항 (mΩ)',
        color: 'rgb(165,46,204)',
        min: 0,
        max: 1000,
    },
    {
        key: 'wire_feeding_speed',
        label: '속도 (m/min)',
        color: 'rgb(46, 204, 113)',
        min: 0,
        max: 250,
    },
]

// Refs
const videoContainerRef = ref<HTMLDivElement>()
const videoEl = ref<HTMLVideoElement>()
const chartCanvasRef = ref<HTMLCanvasElement>()
const chartInstance = shallowRef<Chart | null>(null)

const videoConnected = ref(false)
const isFullScreen = ref(false)
const booths = ref<RealTimeBoothItem[]>([])
const selectedBooth = ref('')
const selectedCamera = ref<{ id: number; name: string; welder_id: number } | undefined>(undefined)
const realtimeData = ref<RealtimeWelderWithR[]>([])
const MAX_DATA_LENGTH = 20
const serverAddress = ref('')
const selectedMetrics = ref<string[]>(['current', 'voltage'])

const cameraSelectors = computed(() => {
    const selected = booths.value.find((value) => value.id === +selectedBooth.value)
    if (selected) {
        return selected.cameras.map((value) => ({ value: value.id, label: value.name }))
    }
    return []
})

// Helpers
const currentVal = computed(
    () => realtimeData.value[realtimeData.value.length - 1]?.current?.toFixed(1) ?? '-'
)
const voltageVal = computed(
    () => realtimeData.value[realtimeData.value.length - 1]?.voltage?.toFixed(1) ?? '-'
)
const speedVal = computed(
    () => realtimeData.value[realtimeData.value.length - 1]?.wire_feeding_speed?.toFixed(1) ?? '-'
)
const resistance = computed(
    () => realtimeData.value[realtimeData.value.length - 1]?.resistance?.toFixed(1) ?? '-'
)

const { changeCam, stop, setVideoEl } = usePlayer(serverAddress)

// WebSocket
const ws = new WebSocket(`${window.location.origin.replace('http', 'ws')}/realtime`)
ws.onmessage = function (event) {
    const data = JSON.parse(event.data) as RealtimeWelder

    if (selectedBooth.value) {
        const booth = booths.value.find((value) => value.id === +selectedBooth.value)
        if (booth && booth.cameras.some((value) => value.welder_id === data.welder_id)) {
            let resistance = 0
            if (data.current > 0) {
                resistance = (data.voltage / data.current) * 1000
                resistance = resistance > 1000 ? 1000 : resistance
            }

            realtimeData.value.push({ ...data, resistance })
            if (realtimeData.value.length > MAX_DATA_LENGTH) {
                realtimeData.value.shift()
            }
            updateChart()
        }
    }
}

// Functions

function initChart() {
    if (!chartCanvasRef.value) return
    if (chartInstance.value) chartInstance.value.destroy()

    const gridColor = isFullScreen.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
    const textColor = isFullScreen.value ? '#ccc' : '#666'

    const config: ChartConfiguration = {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_LENGTH).fill(''),
            datasets: [],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
            },
            scales: {
                x: { display: false },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: gridColor },
                    ticks: { color: textColor },
                },
                y1: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { color: textColor },
                },
            },
        },
    }

    chartInstance.value = new Chart(chartCanvasRef.value, config)
    if (realtimeData.value.length > 0) updateChart()
}

function updateChart() {
    if (!chartInstance.value) {
        return
    }

    const datasets: any[] = []
    let leftAxisUsed = false

    metricOptions.forEach((opt) => {
        if (!selectedMetrics.value.includes(opt.key)) {
            return
        }

        const dataPoints = realtimeData.value.map((d) => (d as any)[opt.key])
        const yAxisID = !leftAxisUsed ? 'y' : 'y1'
        if (!leftAxisUsed) {
            leftAxisUsed = true
        }

        datasets.push({
            label: opt.label,
            data: dataPoints,
            borderColor: opt.color,
            backgroundColor: opt.color,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            yAxisID: yAxisID,
        })
    })

    chartInstance.value.data.datasets = datasets

    const scales = chartInstance.value.options.scales
    if (scales && scales.y && scales.y1) {
        if (datasets.length > 0) {
            const opt1 = metricOptions.find((o) => o.key === selectedMetrics.value[0])
            if (opt1) {
                scales.y.display = true
                scales.y.min = opt1.min
                scales.y.max = opt1.max
                scales.y.ticks = { ...scales.y.ticks, color: opt1.color }
            }
        }

        if (datasets.length > 1) {
            const opt2 = metricOptions.find((o) => o.key === selectedMetrics.value[1])
            if (opt2) {
                scales.y1.display = true
                scales.y1.min = opt2.min
                scales.y1.max = opt2.max
                scales.y1.ticks = { ...scales.y1.ticks, color: opt2.color }
            }
        } else {
            scales.y1.display = false
        }
    }

    chartInstance.value.update('none')
}

function onMetricChange(key: string) {
    const index = selectedMetrics.value.indexOf(key)
    if (index >= 0) {
        selectedMetrics.value.splice(index, 1)
    } else {
        if (selectedMetrics.value.length >= 2) {
            selectedMetrics.value.shift()
        }
        selectedMetrics.value.push(key)
    }
    updateChart()
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

function onFullscreenChange() {
    isFullScreen.value = !!document.fullscreenElement
    nextTick(() => {
        initChart()
    })
}

function connect() {
    if (!selectedCamera.value) {
        videoConnected.value = false
        stop()
        return
    }
    videoConnected.value = true
    const video = videoEl.value
    changeCam(selectedCamera.value.id)
    if (video) {
        setVideoEl(video)
    }
}

function onBoothSelected(e: Event) {
    selectedBooth.value = (e.target as HTMLSelectElement).value
    realtimeData.value = []
    videoConnected.value = false
    updateChart()
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
    fetchAddress()
    fetchItems()
    nextTick(() => {
        initChart()
    })
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    if (chartInstance.value) chartInstance.value.destroy()
})

watch(selectedCamera, () => {
    if (selectedCamera.value) {
        connect()
    } else {
        stop()
        videoConnected.value = false
    }
})
</script>

<style scoped lang="scss">
.page-container {
    @apply flex-1 overflow-auto;
    background-color: #27283d;
}

.content-wrapper {
    @apply p-6;
}

.control-card {
    @apply rounded-lg px-6 py-2 mb-6;

    background-color: #3a3b5b;

    .card-title {
        @apply text-lg font-semibold  mb-4;
        color: white;
    }

    .selector-grid {
        @apply grid grid-cols-1 md:grid-cols-3 gap-4 mb-4;
    }
}

.monitor-card {
    @apply rounded-lg py-6 px-10;
    background-color: #3a3b5b;
    display: flex;
}

/* Video Container */
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

/* Overlays */
.no-signal-overlay {
    @apply absolute inset-0 flex items-center justify-center;
    .icon-circle {
        @apply w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto;
    }
}

/* 전체화면 전용: 좌측 상단 텍스트 */
.fullscreen-text-overlay {
    @apply absolute top-6 left-6 z-20 pointer-events-none;

    .data-box {
        @apply bg-black/50 text-white p-4 rounded-lg backdrop-blur-sm border border-white/10;
        min-width: 180px;

        .overlay-row {
            @apply flex justify-between items-center mb-1 last:mb-0 text-sm;
            .label {
                @apply text-gray-300 mr-3 font-medium;
            }
            .value {
                @apply font-mono font-bold text-green-400;
            }
        }
    }
}

/* 전체화면 전용: 우측 하단 차트 및 컨트롤 */
.fullscreen-chart-overlay {
    @apply absolute bottom-6 right-6 z-20;
    /* [수정] 배경 투명도 높임 (bg-black/30 -> bg-black/10) */
    @apply bg-black/10 backdrop-blur-md rounded-xl;
    /* [수정] 테두리 제거 */

    width: 500px;
    height: 280px;
    padding: 16px;
    @apply flex flex-col;

    transition: background-color 0.3s ease;
    &:hover {
        /* 호버 시 약간 더 어둡게 */
        @apply bg-black/30;
    }

    .chart-controls-overlay {
        @apply flex gap-2 mb-2 justify-end;
    }

    .canvas-wrapper {
        @apply flex-1 relative;
        canvas {
            width: 100% !important;
            height: 100% !important;
        }
    }
}

/* 전체화면용 체크박스 스타일 */
.metric-checkbox-overlay {
    @apply flex items-center px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all;
    @apply bg-white/10 border-white/10 text-gray-300;

    &:hover {
        @apply bg-white/20;
    }

    &.is-active {
        border-color: var(--active-color);
        color: var(--active-color);
        @apply bg-black/40;
    }

    .dot {
        @apply w-2 h-2 rounded-full mr-2;
    }
}

.btn-fullscreen {
    @apply absolute bottom-4 right-4 z-20 p-2 rounded-lg text-white transition-all;
    @apply bg-white/20 hover:bg-white/40 backdrop-blur-sm;
    @apply opacity-0 group-hover:opacity-100 focus:opacity-100;
    i {
        @apply text-2xl;
    }
}

/* Sidebar (일반 모드) */
.data-sidebar {
    width: 500px;
    margin-left: 20px;
    @apply flex flex-col h-[660px];
}

.chart-controls {
    @apply flex gap-2 mb-4;
}

.metric-checkbox {
    @apply flex items-center px-3 py-1.5 rounded-full border text-sm font-medium cursor-pointer transition-all;
    @apply bg-white border-gray-200 text-gray-500;

    &:hover {
        @apply bg-gray-50;
    }
    &.is-active {
        @apply border-transparent text-gray-800 shadow-sm;
        background-color: #f3f4f6;
    }
    .dot {
        @apply w-2.5 h-2.5 rounded-full mr-2;
    }
}

.chart-wrapper {
    @apply flex-1 bg-gray-50 rounded-lg border border-gray-200 p-2 relative;
    min-height: 200px;
}

.current-values {
    @apply mt-4 grid grid-cols-4 gap-2;
    .mini-stat {
        @apply bg-gray-100 rounded p-2 text-center text-sm font-mono text-gray-700;
        .lbl {
            @apply text-gray-400 font-bold mr-1;
        }
    }
}
</style>
