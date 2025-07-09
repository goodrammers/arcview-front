<template>
    <div class="wrapper-container">
        <component
            :is="selectedComp"
            :index="index"
            :videoIndex="videoIndex"
            :isRoi="_isRoi"
        ></component>
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
                <VListItem class="cursor-pointer" @click="() => setVideo(0, false)">
                    영상1
                </VListItem>
                <VListItem class="cursor-pointer" @click="() => setVideo(0, true)">
                    영상1(ROI)
                </VListItem>
                <VListItem class="cursor-pointer" @click="() => setVideo(1, false)">
                    영상2
                </VListItem>
                <VListItem class="cursor-pointer" @click="() => setVideo(1, true)">
                    영상2(ROI)
                </VListItem>
                <VListItem class="cursor-pointer">1</VListItem>
            </VList>
        </VMenu>
    </div>
</template>

<script setup lang="ts">
import Video from '@/components/ViewComp/Video.vue'
import type { Component } from 'vue'

import { ref, shallowRef, toRefs } from 'vue'

const props = defineProps<{ index: number }>()
const { index } = toRefs(props)
const selectedComp = shallowRef<Component | null>(null)
const videoIndex = ref(0)
const _isRoi = ref(false)

function setVideo(index: number, isRoi: boolean) {
    _isRoi.value = isRoi
    videoIndex.value = index
    selectedComp.value = Video
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
