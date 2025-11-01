<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">관리자 메뉴</h1>
            </div>

            <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-6">포트 설정</h2>
                <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div class="flex items-end space-x-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                포트 번호
                            </label>
                            <input
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="포트 번호를 입력하세요"
                                type="number"
                                value="8080"
                            />
                        </div>
                        <button
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                        >
                            적용
                        </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">용접기와 통신에 사용되는 포트를 설정</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
