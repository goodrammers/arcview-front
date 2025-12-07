<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6 bg-white min-h-screen">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900">작업 관리</h1>
            </div>
            <div class="flex space-x-1 mb-6 bg-gray-50 p-1 rounded-lg w-fit">
                <button
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    :class="[
                        selectedTab === 0
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900',
                    ]"
                    @click="() => selectTab(0)"
                >
                    작업실
                </button>
                <button
                    class="px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    :class="[
                        selectedTab === 1
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900',
                    ]"
                    @click="() => selectTab(1)"
                >
                    용접기
                </button>
            </div>
            <VWindow v-model="selectedTab">
                <VWindowItem>
                    <TaskManagerWorks></TaskManagerWorks>
                </VWindowItem>
                <VWindowItem>
                    <TaskManagerWelder></TaskManagerWelder>
                </VWindowItem>
            </VWindow>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TaskManagerWorks from '@/pages/TaskManager/TaskManagerWorks.vue'
import TaskManagerWelder from '@/pages/TaskManager/TaskManagerWelder.vue'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'

const selectedTab = ref(0)

const { fetchBooths, fetchWelders } = useTaskItems()
function selectTab(index: number) {
    selectedTab.value = index
}

async function fetchItems() {
    await Promise.all([fetchBooths(), fetchWelders()])
}

fetchItems()
</script>

<style scoped lang="scss"></style>
