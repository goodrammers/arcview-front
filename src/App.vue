<template>
    <div class="position-relative">
        <div class="d-flex justify-between">
            <div style="width: 50%">
                <FullVideo></FullVideo>
            </div>
            <div style="width: 50%">
                <RoiVideo></RoiVideo>
            </div>
        </div>
        <ControlBar class="control-bar-area"></ControlBar>
    </div>
</template>

<script setup lang="ts">
import FullVideo from '@/components/FullVideo.vue'
import RoiVideo from '@/components/RoiVideo.vue'
import ControlBar from '@/components/ControlBar.vue'
import { useWeldingStore } from '@/store/Welding.ts'

useWeldingStore().updateWelding()
</script>

<style lang="scss">
.control-bar-area {
    position: fixed;
    bottom: 0;
}
html {
    overflow-y: auto !important;
}
</style>
