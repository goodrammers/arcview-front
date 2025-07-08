<template>
    <Layout></Layout>
</template>

<script setup lang="ts">
import { useWeldingStore } from '@/store/Welding.ts'
import Layout from '@/components/Layout.vue'
import { onMounted } from 'vue'

onMounted(() => {
    useWeldingStore().updateWelding('0')
})
</script>

<style lang="scss">
html {
    overflow-y: auto !important;
}
</style>
