<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">관리자 메뉴</h1>
            </div>

            <div>
                <h2 class="text-lg font-semibold text-gray-900 mb-6">서비스 포트 설정</h2>
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
                                v-model="update.port"
                            />
                        </div>
                        <button
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                            @click="setPort"
                        >
                            적용
                        </button>
                    </div>
                </div>
            </div>
            <div class="mt-16">
                <h2 class="text-lg font-semibold text-gray-900 mb-6">동영상 디렉토리 설정</h2>
                <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div class="flex items-end space-x-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                동영상 디렉토리
                            </label>
                            <input
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="디텍토리를 선택하세요"
                                v-model="update.dir"
                            />
                        </div>
                        <button
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                            @click="setDirectory"
                        >
                            적용
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getServicePort, getVideoDir, putServicePort, putVideoDir } from '@/api/Config.ts'
import { ref } from 'vue'
import { ResultCode } from '@/api/Types.ts'

const model = ref({
    port: 0,
    dir: '',
})

const update = ref({
    port: 0,
    dir: '',
})

async function fetch() {
    const p = await getServicePort()
    if (p.code === ResultCode.SUCCESS && p.data) {
        model.value.port = p.data.port
    } else {
        model.value.port = 0
    }
    const v = await getVideoDir()
    if (v.code === ResultCode.SUCCESS && v.data) {
        model.value.dir = v.data.directory
    } else {
        model.value.dir = ''
    }
    update.value = { ...model.value }
}

async function setPort() {
    if (update.value.port !== model.value.port) {
        await putServicePort({ port: update.value.port })
        await fetch()
    }
}

async function setDirectory() {
    if (update.value.dir !== model.value.dir) {
        await putVideoDir({ directory: update.value.dir })
        await fetch()
    }
}
fetch()
</script>

<style scoped lang="scss"></style>
