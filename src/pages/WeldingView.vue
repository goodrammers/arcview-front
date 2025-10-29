<template>
    <VApp>
        <VMain class="position-relative">
            <SplitView :style="`height: calc(100vh - ${scrollBarHeightPx})`">
                <template #topLeft><Wrapper :index="0"></Wrapper></template>
                <template #topRight><Wrapper :index="1"></Wrapper></template>
                <template #bottomLeft><Wrapper :index="2"></Wrapper></template>
                <template #bottomRight><Wrapper :index="3"></Wrapper></template>
            </SplitView>
            <ControlBar :height="scrollBarHeight" class="control-bar-area"></ControlBar>

            <!-- video 숨기기 -->
            <video ref="video1" style="position: fixed; top: 5000px" />
            <video ref="video2" style="position: fixed; top: 5000px" />
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import ControlBar from '@/components/ControlBar.vue'

import { computed, ref } from 'vue'
import SplitView from '@/components/SplitView.vue'
import Wrapper from '@/components/ViewComp/Wrapper.vue'
import { storeToRefs } from 'pinia'
import { useVideoStore } from '@/store/Video.ts'

const { video1, video2 } = storeToRefs(useVideoStore())

const scrollBarHeight = ref(100)
const scrollBarHeightPx = computed(() => scrollBarHeight.value + 'px')
</script>

<style scoped lang="scss">
.control-bar-area {
    position: fixed;
    bottom: 0;
}
</style>
