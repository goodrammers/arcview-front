<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">용접기 목록</h2>
            <button
                @click="onCreateWelder"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
            >
                용접기 추가
            </button>
        </div>
        <div
            v-if="welders.length === 0"
            class="bg-white border border-gray-200 rounded-lg p-12 text-center"
        >
            <div
                class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto"
            >
                <i class="ri-tools-line text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 용접기가 없습니다</h3>
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table class="w-full">
                <thead class="bg-slate-50 border-b border-gray-200">
                    <tr>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            용접기 정보
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            속한 작업실
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            카메라
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            IP
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
                    <tr class="hover:bg-gray-50/50" v-for="welder in welders" :key="welder.id">
                        <td class="px-6 py-4">
                            <div>
                                <div class="text-sm font-medium text-gray-900">
                                    {{ welder.name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ welder.description || '' }}
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ boothName(welder) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ welder.cameras.map((value) => value.name).join(',') }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ welder.ip_address }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ welder.updated_at || '' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex space-x-2">
                                <button
                                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    @click="() => onEdit(welder.id)"
                                >
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    @click="() => onDelete(welder.id)"
                                >
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <VDialog width="400" height="500" v-model="dlg">
            <EditWelder
                :welder-id="selectedWelder"
                @close="() => (dlg = false)"
                :mode="mode"
            ></EditWelder>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { deleteWelder, type Welder } from '@/api/Welder.ts'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import EditWelder from '@/pages/TaskManager/EditWelder.vue'
import { ResultCode } from '@/api/Types.ts'
const { welders, booths } = storeToRefs(useTaskItems())
const dlg = ref(false)
const mode = ref<'create' | 'edit'>('create')
const selectedWelder = ref(-1)
function boothName(welderItem: Welder) {
    if (!welderItem.booth_id) {
        return ''
    }
    const foundBooth = booths.value.find((value) => value.id === welderItem.booth_id)
    return foundBooth ? foundBooth.name : ''
}
function onCreateWelder() {
    selectedWelder.value = -1
    mode.value = 'create'
    dlg.value = true
}

function onEdit(id: number) {
    mode.value = 'edit'
    dlg.value = true
    selectedWelder.value = id
}

async function onDelete(id: number) {
    const ok = confirm('해당 항목을 삭제하시겠습니까?')
    if (ok) {
        const r = await deleteWelder({ id })
        if (r.code !== ResultCode.SUCCESS) {
            alert('삭제에 실패하였습니다.')
        } else {
            await useTaskItems().fetchWelders()
        }
    }
}
</script>

<style scoped lang="scss"></style>
