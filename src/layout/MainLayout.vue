<template>
    <VApp>
        <VMain>
            <Sidebar></Sidebar>
            <router-view></router-view>
        </VMain>
    </VApp>
</template>

<script setup lang="ts">
import router from '@/router'
import Sidebar from '@/layout/Sidebar.vue'

function goTo(path: string) {
    router.push(path)
}
</script>

<style scoped lang="scss"></style>
