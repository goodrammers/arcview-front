<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">작업실 목록</h2>
            <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                @click="createBooth"
            >
                작업실 추가
            </button>
        </div>
        <div
            v-if="booths.length === 0"
            class="bg-white border border-gray-200 rounded-lg p-12 text-center"
        >
            <div
                class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto"
            >
                <i class="ri-building-line text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 작업실이 없습니다</h3>
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table class="w-full">
                <thead class="bg-slate-50 border-b border-gray-200">
                    <tr>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            작업실 정보
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            카메라
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            용접기
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            마지막 수정일
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            작업
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                    <tr v-for="boothItem in booths" class="hover:bg-gray-50/50">
                        <td class="px-6 py-4">
                            <div>
                                <div class="text-sm font-medium text-gray-900">
                                    {{ boothItem.name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ boothItem.location || '' }}
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="space-y-1">
                                <template v-for="welder in boothItem.welders">
                                    <div class="text-xs text-gray-500">
                                        {{ welder.cameras.map((value) => value.name).join(',') }}
                                    </div>
                                </template>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div
                                v-for="welder in boothItem.welders"
                                :key="welder.id"
                                class="text-xs text-gray-500"
                            >
                                {{ welder.name }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ boothItem.updated_at || '' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex space-x-2">
                                <button
                                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    @click="() => onEditBooth(boothItem.id)"
                                >
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    @click="() => onDeleteBooth(boothItem.id)"
                                >
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <VDialog width="400" height="420" v-model="dlg">
            <EditBooth
                @close="() => (dlg = false)"
                :boothId="selectedBoothId"
                :mode="boothEditMode"
            ></EditBooth>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { deleteBooth } from '@/api/Booth.ts'
import { ref } from 'vue'
import EditBooth from '@/pages/TaskManager/EditBooth.vue'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { ResultCode } from '@/api/Types.ts'

const { booths } = storeToRefs(useTaskItems())
const { fetchBooths } = useTaskItems()
const boothEditMode = ref<'create' | 'edit'>('create')
const dlg = ref(false)
const selectedBoothId = ref(-1)

function createBooth() {
    dlg.value = true
    selectedBoothId.value = -1
    boothEditMode.value = 'create'
}

async function onDeleteBooth(id: number) {
    const ok = confirm('해당 작업실을 삭제하시겠습니까?')
    if (!ok) {
        return
    }
    const r = await deleteBooth(id)
    if (r.code === ResultCode.SUCCESS) {
        await fetchBooths()
    } else {
        alert('삭제에 실패했습니다.')
    }
}

function onEditBooth(id: number) {
    dlg.value = true
    selectedBoothId.value = id
    boothEditMode.value = 'edit'
}
</script>

<style scoped lang="scss"></style>
