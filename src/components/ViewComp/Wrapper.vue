<template>
    <div class="wrapper-container">
        <keep-alive>
            <component
                :is="selectedComp"
                :index="index"
                :videoIndex="videoIndex"
                :key="selectedComp"
            ></component>
        </keep-alive>
        <VMenu location="start center" offset="10">
            <template #activator="{ props }">
                <VBtn
                    style="z-index: 10"
                    class="menu-activator"
                    icon="mdi-plus"
                    v-bind="props"
                    variant="flat"
                ></VBtn>
            </template>
            <VList>
                <VListItem
                    :disabled="!isVideoExist(0)"
                    class="cursor-pointer"
                    @click="() => setVideo(0)"
                >
                    영상1
                </VListItem>
                <VListItem
                    :disabled="!isVideoExist(1)"
                    class="cursor-pointer"
                    @click="() => setVideo(1)"
                >
                    영상2
                </VListItem>
                <VListItem class="cursor-pointer" @click="() => setMetaChart()">
                    차트 보기
                </VListItem>
            </VList>
        </VMenu>
    </div>
</template>

<script setup lang="ts">
import Video from '@/components/ViewComp/Video.vue'
import MetaChart from '@/components/ViewComp/MetaChart.vue'
import { type Component } from 'vue'
import { ref, shallowRef, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

const props = defineProps<{ index: number }>()
const { index } = toRefs(props)
const selectedComp = shallowRef<Component | null>(null)
const videoIndex = ref(0)
const { currentJob } = storeToRefs(useWeldingStore())
function isVideoExist(index: number) {
    if (currentJob.value && currentJob.value.videos.length > index) {
        return currentJob.value.videos[index].file_path !== ''
    }
    return false
}

function setVideo(index: number) {
    videoIndex.value = index
    selectedComp.value = Video
}

function setMetaChart() {
    selectedComp.value = MetaChart
}
</script>

<style scoped lang="scss">
.wrapper-container {
    width: 100%;
    height: 100%;
    position: relative;
}
.menu-activator {
    position: absolute;
    top: 100px;
    right: 20px;
    background: rgba(255, 255, 255, 0.25);
}
</style>
