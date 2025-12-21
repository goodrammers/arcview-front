<template>
    <div class="page-container">
        <div class="content-wrapper">
            <div class="page-header">
                <h1 class="page-title">작업 관리</h1>
            </div>

            <div class="tab-group">
                <button
                    class="tab-btn"
                    :class="{ active: selectedTab === 0 }"
                    @click="selectTab(0)"
                >
                    작업실
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: selectedTab === 1 }"
                    @click="selectTab(1)"
                >
                    용접기
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: selectedTab === 2 }"
                    @click="selectTab(2)"
                >
                    카메라
                </button>
            </div>

            <VWindow v-model="selectedTab" class="window-container">
                <VWindowItem>
                    <TaskManagerWorks></TaskManagerWorks>
                </VWindowItem>

                <VWindowItem>
                    <TaskManagerWelder></TaskManagerWelder>
                </VWindowItem>

                <VWindowItem>
                    <CameraManager></CameraManager>
                </VWindowItem>
            </VWindow>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TaskManagerWorks from '@/pages/TaskManager/TaskManagerWorks.vue'
import TaskManagerWelder from '@/pages/TaskManager/TaskManagerWelder.vue'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import CameraManager from '@/pages/TaskManager/CameraManager.vue'

const selectedTab = ref(0)

const { fetchBooths, fetchWelders, fetchCameras } = useTaskItems()

function selectTab(index: number) {
    selectedTab.value = index
}

async function fetchItems() {
    await Promise.all([fetchBooths(), fetchWelders(), fetchCameras()])
}

watch(
    selectedTab,
    () => {
        fetchItems()
    },
    { immediate: true }
)
</script>

<style scoped lang="scss">
/* 1. 전체 레이아웃 */
.page-container {
    background-color: #27283d;
    flex: 1;
    overflow: auto;
    min-height: 100vh;
}

.content-wrapper {
    padding: 24px; /* p-6 */
}

/* 2. 헤더 */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px; /* mb-6 */
}

.page-title {
    font-size: 24px; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: white;
    margin: 0;
}

/* 3. 탭 그룹 */
.tab-group {
    display: flex;
    gap: 4px; /* space-x-1 */
    margin-bottom: 24px; /* mb-6 */
    background-color: #000000; /* bg-gray-50 */
    padding: 4px; /* p-1 */
    border-radius: 8px; /* rounded-lg */
    width: fit-content; /* w-fit */
}

/* 4. 탭 버튼 스타일 */
.tab-btn {
    padding: 8px 16px; /* px-4 py-2 */
    border-radius: 6px; /* rounded-md */
    font-size: 14px; /* text-sm */
    font-weight: 500; /* font-medium */
    white-space: nowrap;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.2s ease; /* transition-colors */

    /* 기본 상태 (Inactive) */
    color: #b3b3b3; /* text-gray-600 */

    /* 활성 상태 (Active) */
    &.active {
        background-color: #3a3b5b;
        color: white; /* text-blue-600 */
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-sm */
    }
}

.window-container {
    margin-top: 50px;
}
</style>
