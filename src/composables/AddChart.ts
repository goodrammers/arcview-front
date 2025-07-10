import { ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { storeToRefs } from 'pinia'
import { type MetaDataItem, useWeldingStore } from '@/store/Welding.ts'
import { useVideoStore } from '@/store/Video.ts'
Chart.register(...registerables)

interface ChartEntry {
    chart: Chart
    canvas: HTMLCanvasElement
    stopWatch: () => void
}

export function useAddChart() {
    const chartMap = new Map<string, ChartEntry>()
    const parentEl = ref<HTMLElement | null>(null)
    const { currentTime } = storeToRefs(useVideoStore())
    const { seek } = useVideoStore()

    function createCanvas() {
        const canvas = document.createElement('canvas')
        canvas.style.backgroundColor = 'black'
        canvas.style.width = '500px'
        canvas.style.height = '200px'
        parentEl.value?.appendChild(canvas)

        return canvas
    }

    function makeData(item: MetaDataItem) {
        return {
            labels: item.value.map((value, index) => index.toString()),
            datasets: [
                {
                    label: item.name,
                    data: item.value.map((value, index) => ({ x: index, y: value })),
                    borderColor: 'yellow',
                    borderWidth: 1,
                    pointRadius: 1,
                    fill: false,
                },
            ],
        }
    }

    function makeVerticalLinePlugin() {
        return {
            id: 'verticalLinePlugin',
            afterDatasetsDraw(chart: Chart) {
                const { ctx, chartArea, scales } = chart
                const xPixel = scales.x.getPixelForValue(currentTime.value)

                ctx.save()
                ctx.beginPath()
                ctx.moveTo(xPixel, chartArea.top)
                ctx.lineTo(xPixel, chartArea.bottom)
                ctx.strokeStyle = '#00ffff'
                ctx.lineWidth = 4
                ctx.stroke()
                ctx.restore()
            },
        }
    }

    function makeOptions() {
        return {
            // 부모 크기 변화에 따라서 크기 조절 사용안함
            // 이 값이 true이면, canvas.style.width / height 설정이 의도되로 되지 않음
            responsive: false,

            plugins: {
                legend: {
                    labels: {
                        // 상단 타이틀 글자 색
                        color: 'white',
                    },
                },
            },
            layout: { padding: { right: 30 } },
            scales: {
                x: {
                    ticks: { color: 'white' },
                    grid: { color: 'rgba(255, 255, 255, 0.8)' },
                },
                y: {
                    ticks: {
                        //@ts-ignore
                        callback: (v) => v.toString().padStart(6, ' ') + ' ', // 항상 폭이 같은 글자
                        color: 'white',
                        font: {
                            // TODO: font 변경
                            family: 'Roboto Mono, Courier New, monospace',
                            size: 12,
                        },
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.8)' },
                },
            },
        }
    }

    function createChart(metaName: string) {
        const { currentItem } = storeToRefs(useWeldingStore())
        const { metaData } = currentItem.value!
        const item = metaData.find((value) => value.name === metaName)
        const parent = parentEl.value
        if (!parent || !item) {
            return
        }
        const canvas = createCanvas()

        const chartConfig: { type: string } = {
            type: 'line',
            // @ts-ignore
            data: makeData(item),
            options: makeOptions(),
            plugins: [makeVerticalLinePlugin()],
        }
        // @ts-ignore
        const chart = new Chart(canvas, chartConfig)
        canvas.addEventListener('click', (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            const xPixel = event.clientX - rect.left
            const xValue = chart.scales.x.getValueForPixel(xPixel)!
            seek(xValue)
        })

        const stopWatch = watch(currentTime, () => {
            chart.update()
        })
        chartMap.set(metaName, {
            chart,
            canvas,
            stopWatch,
        })
    }

    function destroyChart(metaName: string) {
        const entry = chartMap.get(metaName)
        if (!entry) {
            return
        }

        entry.stopWatch()
        entry.chart.destroy()
        entry.canvas.remove()

        chartMap.delete(metaName)
    }

    return {
        parentEl,
        createChart,
        destroyChart,
    }
}
