<template>
    <div class="chart-container">
        <div class="chart-controls" ref="controlsRef">
            <button
                v-for="opt in options"
                :key="opt.value"
                class="metric-btn"
                :class="{ 'is-active': selectedMetrics.includes(opt.value) }"
                @click="toggleMetric(opt.value)"
            >
                <span v-if="getAxisBadge(opt.value)" class="axis-badge">
                    {{ getAxisBadge(opt.value) }}
                </span>
                <span class="dot" :style="{ backgroundColor: opt.color }"></span>
                {{ opt.label }}
            </button>
        </div>

        <div class="canvas-wrapper" ref="wrapperRef">
            <canvas ref="chartCanvas" @click="onCanvasClick"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'
import Chart from 'chart.js/auto'

const props = defineProps<{
    initialMetrics?: string[]
}>()

const emit = defineEmits(['metrics-change'])

const options = [
    {
        value: 'current',
        label: '전류 (A)',
        color: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
    },
    {
        value: 'voltage',
        label: '전압 (V)',
        color: 'rgb(53, 162, 235)',
        borderColor: 'rgb(53, 162, 235)',
    },
    {
        value: 'speed',
        label: '속도 (m/min)',
        color: 'rgb(46, 204, 113)',
        borderColor: 'rgb(46, 204, 113)',
    },
    {
        value: 'resistance',
        label: '저항 (Ω)',
        color: 'rgb(165, 46, 204)',
        borderColor: 'rgb(165, 46, 204)',
    },
]

const selectedMetrics = ref<string[]>(
    props.initialMetrics && props.initialMetrics.length > 0
        ? [...props.initialMetrics]
        : ['current', 'voltage']
)

const wrapperRef = ref<HTMLElement | null>(null)
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = shallowRef<Chart | null>(null)
let resizeObserver: ResizeObserver | null = null

const weldingStore = useWeldingStore()
const { voltages, currents, feedingSpeed, resistances, currentTime, duration } =
    storeToRefs(weldingStore)
const { seekTo } = weldingStore

function toggleMetric(key: string) {
    const index = selectedMetrics.value.indexOf(key)
    if (index >= 0) selectedMetrics.value.splice(index, 1)
    else {
        if (selectedMetrics.value.length >= 2) selectedMetrics.value.shift()
        selectedMetrics.value.push(key)
    }
    emit('metrics-change', [...selectedMetrics.value])
    updateChartData()
}

function getAxisBadge(key: string) {
    const idx = selectedMetrics.value.indexOf(key)
    if (idx === 0) return 'L'
    if (idx === 1) return 'R'
    return null
}

function getDataArray(type: string) {
    switch (type) {
        case 'voltage':
            return voltages.value
        case 'current':
            return currents.value
        case 'speed':
            return feedingSpeed.value
        case 'resistance':
            return resistances.value
        default:
            return []
    }
}

function getOption(type: string) {
    return options.find((o) => o.value === type)
}

const verticalLinePlugin = {
    id: 'verticalCursor',
    afterDatasetsDraw(chart: Chart) {
        if (!chart.scales.x) return
        const { ctx, chartArea, scales } = chart
        const xValue = currentTime.value

        if (xValue < scales.x.min || xValue > scales.x.max) return
        const xPixel = scales.x.getPixelForValue(xValue)

        ctx.save()
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = '#00ffff'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 10
        ctx.moveTo(xPixel, chartArea.top)
        ctx.lineTo(xPixel, chartArea.bottom)
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.restore()
    },
}

function initChart() {
    if (!chartCanvas.value) return
    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'nearest', intersect: false, axis: 'x' },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true, mode: 'index', intersect: false, animation: false },
            },
            scales: {
                x: {
                    type: 'linear',
                    display: true,
                    min: 0,
                    max: duration.value > 0 ? duration.value : undefined,
                    title: {
                        display: true,
                        text: 'Time (s)',
                        color: '#9ca3af',
                        font: { size: 10 },
                    },
                    grid: { color: '#334155' },
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: '#334155' },
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                },
                y1: {
                    type: 'linear',
                    display: false,
                    position: 'right',
                    grid: { display: false },
                    ticks: { color: '#9ca3af', font: { size: 10 } },
                },
            },
        },
        plugins: [verticalLinePlugin],
    })
}

function updateChartData() {
    if (!chartInstance.value) return

    // @ts-ignore
    const datasets = []
    selectedMetrics.value.forEach((metricKey, index) => {
        const data = getDataArray(metricKey)
        const opt = getOption(metricKey)
        if (opt && data.length > 0) {
            datasets.push({
                label: opt.label,
                data: data.map((d) => ({ x: d.timestamp, y: d.value })),
                borderColor: opt.borderColor,
                backgroundColor: opt.color,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.1,
                yAxisID: index === 1 ? 'y1' : 'y',
                borderDash: [],
            })
        }
    })

    // @ts-ignore
    chartInstance.value.data.datasets = datasets

    if (chartInstance.value.options.scales) {
        if (chartInstance.value.options.scales.x) {
            chartInstance.value.options.scales.x.max =
                duration.value > 0 ? duration.value : undefined
        }

        // 왼쪽 축 (y)
        if (chartInstance.value.options.scales.y) {
            chartInstance.value.options.scales.y.display = selectedMetrics.value.length > 0

            // 색상 적용
            if (selectedMetrics.value.length > 0) {
                const opt = getOption(selectedMetrics.value[0])
                if (opt) {
                    // @ts-ignore
                    chartInstance.value.options.scales.y.ticks.color = opt.color
                }
            }
        }

        // 오른쪽 축 (y1)
        if (chartInstance.value.options.scales.y1) {
            chartInstance.value.options.scales.y1.display = selectedMetrics.value.length > 1

            // 색상 적용
            if (selectedMetrics.value.length > 1) {
                const opt = getOption(selectedMetrics.value[1])
                if (opt) {
                    // @ts-ignore
                    chartInstance.value.options.scales.y1.ticks.color = opt.color
                }
            }
        }
    }
    chartInstance.value.update()
}

function onCanvasClick(event: MouseEvent) {
    if (!chartInstance.value || !chartCanvas.value) return
    const rect = chartCanvas.value.getBoundingClientRect()
    const xPixel = event.clientX - rect.left
    const scales = chartInstance.value.scales
    if (scales && scales.x) {
        const timeValue = scales.x.getValueForPixel(xPixel)
        if (timeValue !== undefined) seekTo(timeValue)
    }
}

watch(
    [selectedMetrics, voltages, currents, feedingSpeed, resistances, duration],
    () => updateChartData(),
    { deep: true }
)
watch(currentTime, () => {
    if (chartInstance.value) chartInstance.value.update('none')
})

onMounted(() => {
    initChart()
    updateChartData()
    if (wrapperRef.value) {
        resizeObserver = new ResizeObserver(() => {
            if (chartInstance.value) {
                chartInstance.value.resize()
            }
        })
        resizeObserver.observe(wrapperRef.value)
    }
})

onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect()
    if (chartInstance.value) chartInstance.value.destroy()
})
</script>

<style scoped lang="scss">
.chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #0f172a;
    position: relative;
    overflow: hidden;
    min-width: 0;
    min-height: 0;
}

.chart-controls {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 12px;
    z-index: 10;
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid #1e293b;
    flex-shrink: 0;
}

.metric-btn {
    display: flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    border: 1px solid #334155;
    background-color: #1e293b;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;

    &:hover {
        background-color: #334155;
        color: #e2e8f0;
    }
    &.is-active {
        background-color: #1e293b;
        border-color: #94a3b8;
        color: #fff;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 6px;
    }
    .axis-badge {
        font-size: 9px;
        font-weight: 800;
        margin-right: 6px;
        background-color: #475569;
        color: #fff;
        padding: 0 4px;
        border-radius: 3px;
        height: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.canvas-wrapper {
    flex: 1;
    min-height: 0;
    position: relative;
    width: 100%;
    overflow: hidden;
}

canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
}
</style>
