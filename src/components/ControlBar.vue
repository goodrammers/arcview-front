<template>
    <div class="d-flex flex-column justify-center align-center control-bar-area">
        <div class="d-flex align-center justify-space-between" style="width: 500px">
            <!-- 왼쪽 -->
            <div>
                <VBtn
                    density="compact"
                    base-color="white"
                    variant="tonal"
                    width="36"
                    height="36"
                    :icon="`${isPlaying ? 'mdi-pause' : formatTime(currentTime) !== duration ? 'mdi-play' : 'mdi-refresh'}`"
                    @click="togglePlay"
                ></VBtn>

                <VBtn
                    class="ml-2"
                    density="compact"
                    base-color="white"
                    variant="tonal"
                    width="36"
                    height="36"
                    icon="mdi-stop"
                    @click="stop"
                ></VBtn>
                <span class="text-white ml-8">{{ formatTime(currentTime) }}</span>
                <span class="text-white mx-1">/</span>
                <span class="text-white">{{ duration }}</span>
            </div>
            <!-- 오른쪽 -->
            <div>
                <VBtn
                    class="ml-2"
                    density="compact"
                    base-color="white"
                    variant="tonal"
                    width="36"
                    height="36"
                    icon="mdi-dots-vertical"
                ></VBtn>
            </div>
        </div>
        <div>
            <input
                :max="iDuration"
                :min="0"
                :step="0.01"
                :value="currentTime"
                class="video-progress"
                style="width: 500px"
                type="range"
                @input="onSeek"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { formatTime } from '@/Utils/Formatter.ts'
import { useVideoStore } from '@/store/Video.ts'

const props = defineProps<{ height: number }>()
const heightPx = computed(() => props.height + 'px')

const { isPlaying, currentTime, duration: iDuration } = storeToRefs(useVideoStore())
const { togglePlay, stop, seek } = useVideoStore()
const duration = computed(() => formatTime(iDuration.value))

function onSeek(e: Event) {
    const target = e.target as HTMLInputElement
    seek(+target.value)
}
</script>

<style scoped lang="scss">
.control-bar-area {
    width: 100%;
    height: v-bind(heightPx);
    background: rgba(0, 0, 0, 0.8);
}
.video-progress {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    cursor: pointer;
    padding: 0;
}
</style>
