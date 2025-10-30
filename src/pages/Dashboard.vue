<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6 bg-white min-h-screen">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900">작업 목록</h1>
                <div class="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        class="px-3 py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                        :class="[
                            currentType === 0
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900',
                        ]"
                        @click="() => selectType(0)"
                    >
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-grid-line text-sm"></i>
                        </div>
                    </button>
                    <button
                        class="px-3 py-2 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                        :class="[
                            currentType === 1
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900',
                        ]"
                        @click="() => selectType(1)"
                    >
                        <div class="w-4 h-4 flex items-center justify-center">
                            <i class="ri-list-unordered text-sm"></i>
                        </div>
                    </button>
                </div>
            </div>

            <VWindow v-model="currentType">
                <VWindowItem>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard
                            v-for="job in jobs"
                            :key="job.id"
                            :item="job"
                        ></DashboardCard>
                    </div>
                </VWindowItem>
                <VWindowItem>
                    <DashboardTable :items="jobs"></DashboardTable>
                </VWindowItem>
            </VWindow>
        </div>
    </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/pages/DashboardCard.vue'
import { ref } from 'vue'
import DashboardTable from '@/pages/DashboardTable.vue'
import { fetchJobs, type Job } from '@/api/Jobs.ts'
const currentType = ref(0)
const jobs = ref<Job[]>([])
function selectType(index: number) {
    currentType.value = index
}

async function init() {
    jobs.value = await fetchJobs()
    console.log(jobs.value)
}
init()
</script>

<style scoped lang="scss"></style>
