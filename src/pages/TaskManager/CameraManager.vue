<template>
    <div class="container">
        <div class="header-bar">
            <h2 class="page-title">카메라 목록</h2>
            <button class="create-btn" @click="createCamera">카메라 추가</button>
        </div>

        <div v-if="cameras.length === 0" class="empty-state">
            <div class="icon-circle">
                <i class="ri-building-line"></i>
            </div>
            <h3 class="empty-text">등록된 카메라가 없습니다</h3>
        </div>

        <div v-else class="table-wrapper">
            <table class="custom-table">
                <DataTableHeader :headers="headers"></DataTableHeader>

                <tbody>
                    <tr class="data-row" v-for="camera in cameras" :key="camera.id">
                        <td class="cell text-gray">
                            {{ camera.id }}
                        </td>
                        <td class="cell info-cell">
                            {{ camera.name }}
                        </td>
                        <td class="cell text-gray">
                            {{ camera.description || '' }}
                        </td>
                        <td class="cell text-gray">
                            {{ camera.video_port }}
                        </td>
                        <td class="cell">
                            {{ camera.welder_name || '' }}
                        </td>
                        <td class="cell text-gray">
                            {{ formatDate(camera.updated_at) }}
                        </td>
                        <td class="cell">
                            <div class="action-group">
                                <button
                                    class="action-btn edit"
                                    @click="() => onEditCamera(camera.id)"
                                >
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="action-btn delete"
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
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { deleteCamera } from '@/api/Camera.ts'
import EditCamera from '@/pages/TaskManager/EditCamera.vue'
import { DataTableHeader } from '@/widgets/data-table'
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'
import { formatDate } from '@/Utils/Formatter.ts'

const { cameras } = storeToRefs(useTaskItems())
const { fetchCameras } = useTaskItems()
const dlg = ref(false)
const mode = ref<'create' | 'edit'>('create')
const selectedCameraId = ref(-1)

// 헤더 정의
const headers = ref<DataTableHeaderItem[]>([
    { label: 'ID' },
    { label: '이름' },
    { label: '설명' },
    { label: 'PORT' },
    { label: '용접기' },
    { label: '마지막 수정일' },
    { label: '작업' },
])

function createCamera() {
    selectedCameraId.value = -1
    mode.value = 'create'
    dlg.value = true
}

function onEditCamera(id: number) {
    mode.value = 'edit'
    selectedCameraId.value = id
    dlg.value = true
}

async function onDeleteCamera(id: number) {
    const ok = confirm('해당 카메라를 삭제하시겠습니까?')
    if (ok) {
        await deleteCamera(id)
        await fetchCameras()
    }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* 상단 바 */
.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0;
}

.create-btn {
    padding: 8px 16px;
    background-color: #3e4771;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: background-color 0.2s;
}

/* Empty State */
.empty-state {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 48px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.icon-circle {
    width: 64px;
    height: 64px;
    background-color: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    i {
        font-size: 24px;
        color: #9ca3af;
    }
}

.empty-text {
    font-size: 18px;
    font-weight: 500;
    color: #111827;
    margin: 0;
}

/* Table Wrapper */
.table-wrapper {
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.custom-table {
    width: 100%;
    border-collapse: collapse;
}

/* Data Rows */
.data-row {
    background-color: #ffffff;
    transition: background-color 0.2s;

    &:nth-child(even) {
        background-color: #f9f9f9;
    }

    &:hover {
        background-color: #f3f4f6;
    }
}

.cell {
    padding: 16px 24px;
    font-size: 14px;
    color: #111827;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;

    &.info-cell {
        font-weight: 500;
    }

    &.text-gray {
        color: #6b7280;
    }
}

/* Action Buttons */
.action-group {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    font-size: 18px;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &.edit:hover {
        color: #2563eb;
    }

    &.delete:hover {
        color: #dc2626;
    }
}
</style>
