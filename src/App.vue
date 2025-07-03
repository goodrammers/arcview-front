<template>
    <div class="d-flex justify-between">
        <div style="width: 50%">
            <FullVideo></FullVideo>
        </div>
        <div style="width: 50%">
            <RoiVideo></RoiVideo>
        </div>
    </div>
</template>

<script setup lang="ts">
import FullVideo from '@/components/FullVideo.vue'
import RoiVideo from '@/components/RoiVideo.vue'
</script>

<style scoped></style>
