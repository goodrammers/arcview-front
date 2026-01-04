<template>
    <div class="container">
        <div class="header-bar">
            <h2 class="page-title">Booth List</h2>
            <button class="create-btn" @click="createBooth">Add Booth</button>
        </div>

        <div v-if="booths.length === 0" class="empty-state">
            <div class="icon-circle">
                <i class="ri-building-line"></i>
            </div>
            <h3 class="empty-text">등록된 작업실이 없습니다</h3>
        </div>

        <div v-else class="table-wrapper">
            <table class="custom-table">
                <DataTableHeader :headers="headers"></DataTableHeader>

                <tbody>
                    <tr class="data-row" v-for="boothItem in booths" :key="boothItem.id">
                        <td class="cell info-cell">
                            <div class="info-group">
                                <div class="info-name">
                                    {{ boothItem.name }}
                                </div>
                                <div class="info-desc">
                                    {{ boothItem.location || '' }}
                                </div>
                            </div>
                        </td>
                        <td class="cell">
                            <div class="list-group">
                                <template v-for="welder in boothItem.welders" :key="welder.id">
                                    <div class="list-item text-gray">
                                        {{ welder.cameras.map((value) => value.name).join(',') }}
                                    </div>
                                </template>
                            </div>
                        </td>
                        <td class="cell">
                            <div class="list-group">
                                <div
                                    v-for="welder in boothItem.welders"
                                    :key="welder.id"
                                    class="list-item text-gray"
                                >
                                    {{ welder.name }}
                                </div>
                            </div>
                        </td>
                        <td class="cell text-gray">
                            {{ formatDate(boothItem.updated_at) }}
                        </td>
                        <td class="cell">
                            <div class="action-group">
                                <button
                                    class="action-btn edit"
                                    @click="() => onEditBooth(boothItem.id)"
                                >
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="action-btn delete"
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

        <VDialog width="400" height="600" v-model="dlg">
            <EditBooth
                @close="() => (dlg = false)"
                :boothId="selectedBoothId"
                :mode="boothEditMode"
            ></EditBooth>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@/Utils/Formatter.ts'
import { deleteBooth } from '@/api/Booth.ts'
import EditBooth from '@/pages/TaskManager/EditBooth.vue'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { ResultCode } from '@/api/Types.ts'
import { DataTableHeader } from '@/widgets/data-table'
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'

const { booths } = storeToRefs(useTaskItems())
const { fetchBooths } = useTaskItems()
const boothEditMode = ref<'create' | 'edit'>('create')
const dlg = ref(false)
const selectedBoothId = ref(-1)

// 헤더 정의
const headers = ref<DataTableHeaderItem[]>([
    { label: 'Booth Overview' },
    { label: 'Camera' },
    { label: 'Welding Unit' },
    { label: 'Last Modified' },
    { label: 'Actions' },
])

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

    &.text-gray {
        color: #6b7280;
    }
}

/* Info Group */
.info-group {
    display: flex;
    flex-direction: column;
}

.info-name {
    font-weight: 500;
    color: #111827;
}

.info-desc {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
}

/* List Items (Cameras, Welders) */
.list-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.list-item {
    font-size: 12px;
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
