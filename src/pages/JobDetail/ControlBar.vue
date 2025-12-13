<template>
    <div class="player-bar">
        <div class="control-group">
            <button class="play-btn" @click="togglePlay"><i :class="playIcon"></i></button>
            <button class="icon-btn stop-btn" @click="stop"><i class="ri-stop-fill"></i></button>
            <span class="time-display">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
        </div>
        <div class="progress-wrapper">
            <input
                type="range"
                class="video-progress"
                :min="0"
                :max="duration"
                :step="0.01"
                :value="currentTime"
                @input="onSeek"
            />
            <div class="progress-track-bg">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
        </div>
        <div class="control-group right">
            <button class="icon-btn fullscreen-btn" @click="$emit('toggle-fullscreen')">
                <i :class="isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'"></i>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

defineProps<{ isFullscreen: boolean }>()
defineEmits(['toggle-fullscreen'])

const weldingStore = useWeldingStore() // Correct store
const { isPlaying, currentTime, duration } = storeToRefs(weldingStore)
const { togglePlay, stop, seekTo } = weldingStore

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))

const playIcon = computed(() => {
    if (isPlaying.value) return 'ri-pause-fill'
    if (currentTime.value >= duration.value && duration.value > 0) return 'ri-refresh-line'
    return 'ri-play-fill'
})

const progressPercent = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
})

function onSeek(e: Event) {
    const target = e.target as HTMLInputElement
    seekTo(+target.value)
}
</script>

<style scoped lang="scss">
.player-bar {
    height: 64px;
    background: #fff;
    border-top: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
    justify-content: space-between;
}
.control-group {
    display: flex;
    align-items: center;
    gap: 12px;
    &.right {
        gap: 8px;
    }
}
.play-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #3b82f6;
    color: #fff;
    border: none;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background: #2563eb;
    }
}
.icon-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #94a3b8;
    cursor: pointer;
    &:hover {
        color: #64748b;
    }
    &.stop-btn:hover {
        color: #ef4444;
    }
}
.time-display {
    font-family: monospace;
    font-size: 13px;
    color: #334155;
    min-width: 90px;
}
.progress-wrapper {
    flex: 1;
    height: 20px;
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 8px;
}
.video-progress {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
    opacity: 0;
    cursor: pointer;
    margin: 0;
}
.progress-track-bg {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;
    z-index: 1;
    pointer-events: none;
}
.progress-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.1s linear;
}
</style>
