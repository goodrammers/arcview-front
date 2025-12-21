<template>
    <div class="header-container">
        <div class="header-content">
            <div class="header-row">
                <div class="left-section">
                    <button class="back-btn" @click="onClickBack">
                        <i class="ri-arrow-left-line"></i>
                    </button>

                    <div class="title-group">
                        <h1 class="page-title">작업 ID - {{ currentJobId }}</h1>
                        <div class="meta-info">
                            <span>작업실: {{ boothName }}</span>
                            <span>용접기: {{ welderName }}</span>

                            <span v-for="video in videoList" :key="video.index">
                                {{ video.camera_name }}: {{ video.fileName ? video.fileName : '-' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

const router = useRouter()
const weldingStore = useWeldingStore()

const { currentJobId, boothName, welderName, videoList } = storeToRefs(weldingStore)

function onClickBack() {
    router.push('/')
}
</script>

<style scoped lang="scss">
.header-container {
    background-color: #3a3b5b;
    flex-shrink: 0;
    color: white;
}

.header-content {
    max-width: 1280px; /* max-w-7xl */
    margin: 0 auto;
    padding: 0 24px; /* px-6 정도 */
}

.header-row {
    height: 64px; /* h-16 */
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.left-section {
    display: flex;
    align-items: center;
    gap: 16px; /* space-x-4 */
}

.back-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 20px; /* icon size */
    transition: color 0.2s;
}

.title-group {
    display: flex;
    flex-direction: column;
}

.page-title {
    font-size: 20px; /* text-xl */
    font-weight: 600; /* font-semibold */
    margin: 0;
}

.meta-info {
    display: flex;
    align-items: center;
    gap: 24px; /* space-x-6 */
    font-size: 14px; /* text-sm */
    margin-top: 4px; /* mt-1 */
}
</style>
