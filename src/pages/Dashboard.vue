<template>
    <div class="flex-1 overflow-auto dashboard-root">
        <div class="p-6 min-h-screen">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-[#D9D9D9]">Task List</h1>
            </div>
            <DashboardTable
                :items="jobs"
                :page="page"
                :total-page="totalPage"
                :total-count="totalCount"
                :sort-key="sortKey"
                :order="order"
                @update:page="onPageChange"
                @update:sort="onSortChange"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardTable from '@/pages/DashboardTable.vue'
import { getJobs, type Job } from '@/api/Jobs.ts'

const jobs = ref<Job[]>([])
const page = ref(1)
const size = ref(15)
const sortKey = ref('start_time')
const order = ref<'asc' | 'desc'>('desc')
const totalPage = ref(0)
const totalCount = ref(0)

async function fetchJobs() {
    const r = await getJobs({
        page: page.value,
        size: size.value,
        sort_key: sortKey.value,
        order: order.value,
    })
    if (r.code === 200 && r.data) {
        jobs.value = r.data
        if (r.page) {
            totalPage.value = r.page.total_page
            totalCount.value = r.page.total_count
        }
    } else {
        jobs.value = []
    }
}

function onPageChange(newPage: number) {
    page.value = newPage
    fetchJobs()
}

function onSortChange(payload: { sortKey: string; order: 'asc' | 'desc' }) {
    sortKey.value = payload.sortKey
    order.value = payload.order
    page.value = 1
    fetchJobs()
}

fetchJobs()
</script>

<style scoped lang="scss">
.dashboard-root {
    background-color: #27283d;
}
</style>
