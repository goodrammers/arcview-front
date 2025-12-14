<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">카메라 목록</h2>
            <button
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"
                @click="createCamera"
            >
                카메라 추가
            </button>
        </div>
        <div
            v-if="cameras.length === 0"
            class="bg-white border border-gray-200 rounded-lg p-12 text-center"
        >
            <div
                class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto"
            >
                <i class="ri-building-line text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 카메라가 없습니다</h3>
        </div>
        <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table class="w-full">
                <thead class="bg-slate-50 border-b border-gray-200">
                    <tr>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            ID
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            이름
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            설명
                        </th>
                        <th
                            class="px-6 py-4 text-left text-sm font-semibold text-slate-700 tracking-wide"
                        >
                            PORT
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
                    <tr v-for="camera in cameras" class="hover:bg-gray-50/50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.id }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.description || '' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.video_port }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.welder_name || '' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ camera.updated_at || '' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex space-x-2">
                                <button
                                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                    @click="() => onEditCamera(camera.id)"
                                >
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    @click="() => onDeleteCamera(camera.id)"
                                >
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <VDialog width="400" height="480" v-model="dlg">
            <EditCamera
                :mode="mode"
                :camera-id="selectedCameraId"
                @close="() => (dlg = false)"
            ></EditCamera>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { deleteCamera } from '@/api/Camera.ts'
import { ref } from 'vue'
import EditCamera from '@/pages/TaskManager/EditCamera.vue'

const { cameras } = storeToRefs(useTaskItems())
const { fetchCameras } = useTaskItems()
const dlg = ref(false)
const mode = ref<'create' | 'edit'>('create')
const selectedCameraId = ref(-1)

function createCamera() {
    dlg.value = true
}

function onEditCamera(id: number) {
    mode.value = 'edit'
    selectedCameraId.value = id
    dlg.value = true
}
async function onDeleteCamera(id: number) {
    const ok = confirm('해당 카메라를 삭제하시겠니까?')
    if (ok) {
        await deleteCamera(id)
        await fetchCameras()
    }
}
</script>

<style scoped lang="scss"></style>
