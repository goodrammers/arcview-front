<template>
    <div class="root pa-5" ref="parentEl"></div>
</template>

<script setup lang="ts">
import { useAddChart } from '@/composables/AddChart.ts'
import { onMounted } from 'vue'
const { parentEl, createChart } = useAddChart()

onMounted(() => {
    createChart('current')
    createChart('wire_feeding_speed')
    createChart('voltage')
})
</script>

<style scoped lang="scss">
.root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}
</style>
