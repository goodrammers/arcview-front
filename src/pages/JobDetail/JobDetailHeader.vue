<template>
    <div class="bg-white shadow-sm border-b flex-shrink-0">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-4">
                    <button
                        class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 cursor-pointer"
                        @click="onClickBack"
                    >
                        <i class="ri-arrow-left-line text-xl"></i>
                    </button>

                    <div>
                        <h1 class="text-xl font-semibold text-gray-900">
                            작업 ID - {{ currentJobId }}
                        </h1>
                        <div class="flex items-center space-x-6 text-sm text-gray-600 mt-1">
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

<style scoped lang="scss"></style>
