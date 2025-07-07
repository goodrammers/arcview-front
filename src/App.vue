<template>
    <Layout></Layout>
</template>

<script setup lang="ts">
import { useWeldingStore } from '@/store/Welding.ts'
import Layout from '@/components/Layout.vue'

useWeldingStore().updateWelding()
</script>

<style lang="scss">
html {
    overflow-y: auto !important;
}
</style>
