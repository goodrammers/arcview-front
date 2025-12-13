import { ref, reactive, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

export type SlotKey = 'tl' | 'tr' | 'bl' | 'br'

export function useDashboardGrid(dashboardCardRef: Ref<HTMLElement | null>) {
    const weldingStore = useWeldingStore()
    const { videoList } = storeToRefs(weldingStore)
    const availableVideos = computed(() => videoList.value)
    const STORAGE_KEY = 'dashboard_layout_config'
    const isFullscreen = ref(false)
    const activeMenuSlot = ref<SlotKey | null>(null)
    const menuPos = reactive({ x: 0, y: 0 })

    const slots = reactive<Record<SlotKey, string>>({
        tl: 'EMPTY',
        tr: 'EMPTY',
        bl: 'EMPTY',
        br: 'EMPTY',
    })
    const chartConfigs = reactive<Record<SlotKey, string[]>>({
        tl: [],
        tr: [],
        bl: [],
        br: [],
    })
    const splitX = ref(50)
    const splitY = ref(50)
    const isResizing = ref(false)
    let resizeAxis: 'x' | 'y' | null = null

    const gridStyle = computed(() => ({
        gridTemplateColumns: `${splitX.value}% 6px 1fr`,
        gridTemplateRows: `${splitY.value}% 6px 1fr`,
    }))

    // 저장된 설정 불러오기
    function initLayout() {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.slots) {
                    Object.assign(slots, parsed.slots)
                    if (parsed.chartConfigs) {
                        Object.assign(chartConfigs, parsed.chartConfigs)
                    }
                }
            } catch {
                applyDefaultLayout()
            }
        } else {
            applyDefaultLayout()
        }
    }

    function applyDefaultLayout() {
        slots.tl = 'VIDEO_0'
        slots.tr = 'VIDEO_1'
        slots.bl = 'WELDING_CHART'
        slots.br = 'EMPTY'

        // 차트 기본값 설정 (예: 3사분면은 전압/전류)
        chartConfigs.bl = ['voltage', 'current']
    }

    // 통합 저장
    function saveLayout() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                slots,
                chartConfigs,
            })
        )
    }

    function updateChartConfig(slot: SlotKey, metrics: string[]) {
        chartConfigs[slot] = metrics
        saveLayout()
    }

    function extractVideoIndex(typeString: string): number {
        const index = parseInt(typeString.split('_')[1])
        return isNaN(index) ? 0 : index
    }

    function openMenu(key: SlotKey, e: MouseEvent) {
        activeMenuSlot.value = key
        if (dashboardCardRef.value) {
            const rect = dashboardCardRef.value.getBoundingClientRect()
            let x = e.clientX - rect.left
            let y = e.clientY - rect.top

            const MENU_WIDTH = 200
            const MENU_HEIGHT = 200
            if (x + MENU_WIDTH > rect.width) {
                x -= MENU_WIDTH
            }
            if (y + MENU_HEIGHT > rect.height) {
                y -= MENU_HEIGHT
            }

            menuPos.x = x
            menuPos.y = y
        }
    }

    function selectContent(type: string) {
        if (activeMenuSlot.value) {
            const key = activeMenuSlot.value
            slots[key] = type

            // 차트를 새로 선택한 경우, 기본값 초기화가 필요하다면 여기서 수행
            if (
                type === 'WELDING_CHART' &&
                (!chartConfigs[key] || chartConfigs[key].length === 0)
            ) {
                chartConfigs[key] = ['voltage', 'current']
            }

            saveLayout()
            activeMenuSlot.value = null
        }
    }

    function onGlobalClick(e: MouseEvent) {
        const target = e.target as HTMLElement
        if (
            target.closest('.content-menu') ||
            target.closest('.more-btn') ||
            target.closest('.add-btn')
        )
            return
        activeMenuSlot.value = null
    }

    function startResize(axis: 'x' | 'y') {
        isResizing.value = true
        resizeAxis = axis
        window.addEventListener('mousemove', onResize)
        window.addEventListener('mouseup', stopResize)
    }

    function onResize(e: MouseEvent) {
        if (!dashboardCardRef.value || !resizeAxis) return
        const rect = dashboardCardRef.value.querySelector('.grid-section')?.getBoundingClientRect()
        if (!rect) return

        if (resizeAxis === 'x') {
            let val = ((e.clientX - rect.left) / rect.width) * 100
            splitX.value = Math.min(Math.max(val, 10), 90)
        } else {
            let val = ((e.clientY - rect.top) / rect.height) * 100
            splitY.value = Math.min(Math.max(val, 10), 90)
        }
    }

    function stopResize() {
        isResizing.value = false
        resizeAxis = null
        window.removeEventListener('mousemove', onResize)
        window.removeEventListener('mouseup', stopResize)
    }

    function toggleFullscreen() {
        if (!dashboardCardRef.value) {
            return
        }
        if (!document.fullscreenElement) {
            dashboardCardRef.value.requestFullscreen().catch(() => {})
        } else {
            document.exitFullscreen()
        }
    }
    function onFullscreenChange() {
        isFullscreen.value = !!document.fullscreenElement
    }

    onMounted(() => {
        initLayout()
        window.addEventListener('click', onGlobalClick)
        document.addEventListener('fullscreenchange', onFullscreenChange)
    })

    onUnmounted(() => {
        window.removeEventListener('click', onGlobalClick)
        document.removeEventListener('fullscreenchange', onFullscreenChange)
        window.removeEventListener('mousemove', onResize)
        window.removeEventListener('mouseup', stopResize)
    })

    return {
        availableVideos,
        slots,
        chartConfigs,
        activeMenuSlot,
        menuPos,
        gridStyle,
        isFullscreen,

        openMenu,
        selectContent,
        extractVideoIndex,
        startResize,
        toggleFullscreen,
        updateChartConfig,
    }
}
