<template>
    <div class="dashboard-card" ref="dashboardCardRef">
        <div class="grid-section" :style="gridStyle">
            <div v-for="area in areaList" :key="area.key" class="grid-item" :class="area.class">
                <div class="cell-wrapper">
                    <div
                        v-if="slots[area.key] === 'EMPTY'"
                        class="empty-placeholder"
                        @click.stop="openMenu(area.key, $event)"
                    >
                        <button class="add-btn"><i class="ri-add-line"></i></button>
                        <span class="empty-text">Select Screen</span>
                    </div>
                    <div v-else class="content-filled">
                        <div class="content-body-full">
                            <template v-if="slots[area.key].startsWith('VIDEO_')">
                                <VideoView :videoIndex="extractVideoIndex(slots[area.key])" />
                            </template>

                            <template v-else-if="slots[area.key] === 'WELDING_CHART'">
                                <WeldingChart
                                    :initialMetrics="chartConfigs[area.key]"
                                    @metrics-change="(m) => updateChartConfig(area.key, m)"
                                />
                            </template>
                        </div>
                        <button class="more-btn" @click.stop="openMenu(area.key, $event)">
                            <i class="ri-more-2-fill"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="resizer-v" @mousedown.prevent="startResize('x')">
                <div class="handle-line"></div>
            </div>
            <div class="resizer-h" @mousedown.prevent="startResize('y')">
                <div class="handle-line"></div>
            </div>
            <div class="resizer-center"><i class="ri-drag-move-2-fill"></i></div>

            <div
                v-if="activeMenuSlot"
                class="content-menu"
                :style="{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }"
                @click.stop
            >
                <div class="menu-header">Select Screen</div>
                <ul class="menu-list">
                    <li
                        v-for="(video, idx) in availableVideos"
                        :key="idx"
                        @click="selectContent(`VIDEO_${idx}`)"
                        :class="{ active: slots[activeMenuSlot] === `VIDEO_${idx}` }"
                    >
                        <i class="ri-camera-fill"></i>
                        {{ video.camera_name }}
                    </li>
                    <li v-if="availableVideos.length === 0" class="disabled-item">
                        <i class="ri-camera-off-line"></i>
                        No camera data
                    </li>
                    <li
                        @click="selectContent('WELDING_CHART')"
                        :class="{ active: slots[activeMenuSlot] === 'WELDING_CHART' }"
                    >
                        <i class="ri-line-chart-line text-blue-icon"></i>
                        Chart
                    </li>
                </ul>
            </div>
        </div>
        <ControlBar :is-fullscreen="isFullscreen" @toggle-fullscreen="toggleFullscreen" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDashboardGrid } from './DashboardGrid.ts'
import WeldingChart from './WeldingChart.vue'
import VideoView from './VideoView.vue'
import ControlBar from './ControlBar.vue'

const dashboardCardRef = ref<HTMLElement | null>(null)
const {
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
} = useDashboardGrid(dashboardCardRef)

const areaList = [
    { key: 'tl', class: 'area-tl' },
    { key: 'tr', class: 'area-tr' },
    { key: 'bl', class: 'area-bl' },
    { key: 'br', class: 'area-br' },
] as const
</script>

<style scoped lang="scss">
.dashboard-card {
    flex: 1;
    width: 100%;
    max-width: 1280px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    &:fullscreen {
        max-width: none;
        border: none;
        border-radius: 0;
        background: #000;
        .grid-section {
            background: #111;
        }
        .player-bar {
            background: #1f2937;
            border-top: 1px solid #374151;
            :deep(.time-display) {
                color: #ccc;
            }
        }
    }
}
.grid-section {
    flex: 1;
    display: grid;
    gap: 0;
    position: relative;
    background: #111827;
    min-height: 0;
}
.area-tl {
    grid-column: 1;
    grid-row: 1;
}
.area-tr {
    grid-column: 3;
    grid-row: 1;
}
.area-bl {
    grid-column: 1;
    grid-row: 3;
}
.area-br {
    grid-column: 3;
    grid-row: 3;
}
.grid-item {
    position: relative;
    overflow: hidden;
    border: 1px solid #1f2937;
    background: #0f172a;
    display: flex;
}
.cell-wrapper {
    flex: 1;
    position: relative;
    display: flex;
}
.empty-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    color: #64748b;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background: #1e293b;
        .add-btn {
            transform: scale(1.1);
            background: #3b82f6;
            color: #fff;
            border-color: #3b82f6;
        }
    }
}
.add-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px dashed #475569;
    background: none;
    color: #475569;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    transition: 0.2s;
}
.empty-text {
    font-size: 13px;
    font-weight: 500;
}
.content-filled {
    flex: 1;
    position: relative;
    display: flex;
}
.content-body-full {
    flex: 1;
    display: flex;
}
.more-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 50;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: 0.2s;
}
.content-filled:hover .more-btn {
    opacity: 1;
}
.more-btn:hover {
    background: #3b82f6;
}
.text-blue-icon {
    color: #60a5fa;
}
.resizer-v {
    grid-column: 2;
    grid-row: 1 / -1;
    cursor: col-resize;
    background: #111827;
    display: flex;
    justify-content: center;
    z-index: 90;
    .handle-line {
        width: 2px;
        height: 100%;
        background: #374151;
    }
    &:hover .handle-line {
        background: #3b82f6;
    }
}
.resizer-h {
    grid-column: 1 / -1;
    grid-row: 2;
    cursor: row-resize;
    background: #111827;
    display: flex;
    align-items: center;
    z-index: 90;
    .handle-line {
        height: 2px;
        width: 100%;
        background: #374151;
    }
    &:hover .handle-line {
        background: #3b82f6;
    }
}
.resizer-center {
    grid-column: 2;
    grid-row: 2;
    background: #374151;
    color: #9ca3af;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 91;
    pointer-events: none;
    i {
        font-size: 12px;
    }
}
.content-menu {
    position: absolute;
    width: 200px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
    z-index: 200;
    overflow: hidden;
    animation: fadeIn 0.15s ease;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.menu-header {
    background: #f8fafc;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
}
.menu-list {
    list-style: none;
    padding: 5px 0;
    margin: 0;
}
.menu-list li {
    padding: 8px 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #334155;
    transition: 0.1s;
    &:hover {
        background: #f1f5f9;
    }
    &.active {
        color: #2563eb;
        background: #eff6ff;
        font-weight: 600;
    }
    &.disabled-item {
        cursor: default;
        color: #94a3b8;
        &:hover {
            background: none;
        }
    }
    i {
        color: #94a3b8;
        font-size: 16px;
    }
    &.active i {
        color: #2563eb;
    }
}
</style>
