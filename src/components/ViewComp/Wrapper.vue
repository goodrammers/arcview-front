<template>
    <div class="wrapper-container">
        <component :is="selectedComp" :index="index" :videoIndex="index % 2"></component>
    </div>
</template>

<script setup lang="ts">
import Video from '@/components/ViewComp/Video.vue'

import { shallowRef, toRefs } from 'vue'

const props = defineProps<{ index: number }>()
const { index } = toRefs(props)
const selectedComp = shallowRef(Video)
</script>

<style scoped lang="scss">
.wrapper-container {
    width: 100%;
    height: 100%;
}
</style>
