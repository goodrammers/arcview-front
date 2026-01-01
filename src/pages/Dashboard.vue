<template>
    <div class="flex-1 overflow-auto dashboard-root">
        <div class="p-6 min-h-screen">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-[#D9D9D9]">작업 목록</h1>
            </div>
            <DashboardTable :items="jobs"></DashboardTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardTable from '@/pages/DashboardTable.vue'
import { getJobs, type Job } from '@/api/Jobs.ts'

const jobs = ref<Job[]>([])

async function init() {
    const r = await getJobs()
    if (r.code && r.data) {
        jobs.value = r.data
    } else {
        jobs.value = []
    }
}
init()
</script>

<style scoped lang="scss">
.dashboard-root {
    background-color: #27283d;
}
</style>
