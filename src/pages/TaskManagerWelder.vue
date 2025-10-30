<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">용접기 목록</h2>
            <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
                용접기 추가
            </button>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div
                class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto"
            >
                <i class="ri-tools-line text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 용접기가 없습니다</h3>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
