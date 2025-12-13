<template>
    <div class="page-root">
        <JobDetailHeader class="header-fixed" />

        <div class="content-body">
            <DashboardQuadGrid />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useWeldingStore } from '@/store/Welding.ts'
import { useHiddenVideoManager } from './HiddenVideoManager.ts'
import JobDetailHeader from '@/pages/JobDetail/JobDetailHeader.vue'
import DashboardQuadGrid from '@/pages/JobDetail/DashboardQuadGrid.vue'

const route = useRoute()
const weldingStore = useWeldingStore()
const { fetchJob } = weldingStore

const jobId = (route.query as { id: string }).id
fetchJob(jobId)

// 비디오 매니저 실행
useHiddenVideoManager()
</script>

<style scoped lang="scss">
.page-root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    min-width: 0;
    background-color: #f5f7fa;
}

.header-fixed {
    flex-shrink: 0;
}

.content-body {
    flex: 1;
    padding: 32px;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>
