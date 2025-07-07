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
                style="width: 500px"
                class="video-progress"
                type="range"
                min="0"
                :max="iDuration"
                step="0.01"
                :value="currentTime"
                @input="onSeek"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWeldingStore } from '@/store/Welding.ts'
import { storeToRefs } from 'pinia'
import { formatTime } from '@/Utils/Formatter.ts'

const { files, isPlaying, currentTime } = storeToRefs(useWeldingStore())
const { togglePlay, stop, seek } = useWeldingStore()
const iDuration = ref(0)
const duration = ref('')

function onSeek(e: InputEvent) {
    const target = e.target as HTMLInputElement
    seek(+target.value)
}

watch(
    files,
    () => {
        if (files.value[0].duration > 0) {
            iDuration.value = files.value[0].duration
            duration.value = formatTime(files.value[0].duration)
        }
    },
    { deep: true }
)
</script>

<style scoped lang="scss">
.control-bar-area {
    width: 100%;
    height: 100px;
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
