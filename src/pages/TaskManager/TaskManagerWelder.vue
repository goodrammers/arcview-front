<template>
    <div class="container">
        <div class="header-bar">
            <h2 class="page-title">Welder List</h2>
            <button @click="onCreateWelder" class="create-btn">Add Welder</button>
        </div>

        <div v-if="welders.length === 0" class="empty-state">
            <div class="icon-circle">
                <i class="ri-tools-line"></i>
            </div>
            <h3 class="empty-text">No welders found</h3>
        </div>

        <div v-else class="table-wrapper">
            <table class="custom-table">
                <DataTableHeader :headers="headers"></DataTableHeader>

                <tbody>
                    <tr class="data-row" v-for="welder in welders" :key="welder.id">
                        <td class="cell info-cell">
                            <div class="info-group">
                                <div class="info-name">{{ welder.name }}</div>
                                <div class="info-desc">{{ welder.description || '' }}</div>
                            </div>
                        </td>
                        <td class="cell">
                            {{ boothName(welder) }}
                        </td>
                        <td class="cell">
                            {{ welder.cameras.map((value) => value.name).join(', ') }}
                        </td>
                        <td class="cell text-gray">
                            {{ welder.ip_address }}
                        </td>
                        <td class="cell text-gray">
                            {{ formatDate(welder.updated_at) }}
                        </td>
                        <td class="cell">
                            <div class="action-group">
                                <button class="action-btn edit" @click="() => onEdit(welder.id)">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button
                                    class="action-btn delete"
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

        <VDialog width="400" height="700" v-model="dlg">
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
import { DataTableHeader, type DataTableHeaderItem } from '@/widgets/data-table'
import { formatDate } from '@/Utils/Formatter.ts'

const { welders, booths } = storeToRefs(useTaskItems())
const dlg = ref(false)
const mode = ref<'create' | 'edit'>('create')
const selectedWelder = ref(-1)

// 헤더 정의
const headers = ref<DataTableHeaderItem[]>([
    { label: 'Welder Info' },
    { label: 'Assigned Booth' },
    { label: 'Camera' },
    { label: 'IP' },
    { label: 'Last Modified' },
    { label: 'Actions' },
])

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
    const ok = confirm('Are you sure you want to delete this welder?')
    if (ok) {
        const r = await deleteWelder({ id })
        if (r.code !== ResultCode.SUCCESS) {
            alert('Failed to delete.')
        } else {
            await useTaskItems().fetchWelders()
        }
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

    /* Zebra Striping */
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

/* Info Group (Name + Desc) */
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
        color: #2563eb; /* Blue */
    }

    &.delete:hover {
        color: #dc2626; /* Red */
    }
}
</style>
