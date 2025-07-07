<template>
    <VApp>
        <VMain class="position-relative">
            <SplitView :style="`height: calc(100vh - ${scrollBarHeightPx})`">
                <template #topLeft><component :is="topLeft"></component></template>
                <template #topRight><component :is="topRight"></component></template>
                <template #bottomLeft><component :is="bottomLeft"></component></template>
                <template #bottomRight><component :is="bottomRight"></component></template>
            </SplitView>
            <ControlBar :height="scrollBarHeight" class="control-bar-area"></ControlBar>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import RoiVideo from '@/components/RoiVideo.vue'
import ControlBar from '@/components/ControlBar.vue'
import FullVideo from '@/components/FullVideo.vue'
import DefaultViewComp from '@/components/DefaultViewComp.vue'

import { computed, ref } from 'vue'
import SplitView from '@/components/SplitView.vue'

const topLeft = ref(FullVideo)
const topRight = ref(RoiVideo)
const bottomLeft = ref(DefaultViewComp)
const bottomRight = ref(DefaultViewComp)

const scrollBarHeight = ref(100)
const scrollBarHeightPx = computed(() => scrollBarHeight.value + 'px')
</script>

<style scoped lang="scss">
.control-bar-area {
    position: fixed;
    bottom: 0;
}
</style>
