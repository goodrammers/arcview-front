<template>
    <div class="table-container">
        <div class="scroll-wrapper">
            <table class="custom-table">
                <DataTableHeader :headers="tableHeaders"></DataTableHeader>

                <tbody>
                    <tr
                        class="data-row"
                        v-for="item in items"
                        :key="item.id"
                        @click="() => onClicked(item.id)"
                    >
                        <td class="cell id-cell">
                            {{ item.id }}
                        </td>
                        <td class="cell">{{ item.booth_name }}</td>
                        <td class="cell">{{ item.welder_name }}</td>
                        <td class="cell">
                            {{ item.videos.length > 0 ? item.videos[0].file_path || '-' : '' }}
                        </td>
                        <td class="cell">
                            {{ item.videos.length > 1 ? item.videos[1].file_path || '-' : '' }}
                        </td>
                        <td class="cell">{{ formatStamp(item.start_time) }}</td>
                        <td class="cell">{{ formatStamp(item.end_time) }}</td>
                        <td class="cell">
                            {{ formatDuration(item.start_time, item.end_time) }}
                        </td>
                        <td class="cell action-cell">
                            <div class="action-buttons">
                                <button class="btn-icon edit">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button class="btn-icon delete">
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { type Job } from '@/api/Jobs.ts'
import { formatDuration } from '@/Utils/Formatter.ts'
import { DataTableHeader } from '@/widgets/data-table'
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'

const router = useRouter()
const props = defineProps<{ items: Job[] }>()
const { items } = toRefs(props)

const tableHeaders = ref<DataTableHeaderItem[]>([
    { label: '이름' },
    { label: '작업실' },
    { label: '용접기' },
    { label: '카메라1' },
    { label: '카메라2' },
    { label: '시작 시간' },
    { label: '종료 시간' },
    { label: '길이' },
    { label: '작업', align: 'right' },
])

function formatStamp(stamp: number) {
    const date = new Date(stamp / 1000)
    const YYYY = String(date.getFullYear())
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const DD = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

async function onClicked(id: number) {
    router.push({ path: '/job-detail', query: { id } })
}
</script>

<style scoped lang="scss">
/* 1. 컨테이너 스타일 (테이블 바깥 영역) */
.table-container {
    /* [수정] !important를 추가하여 배경색 강제 적용 */
    background-color: #27283d !important;
    border: 1px solid #3e4771;
    border-radius: 8px;
    overflow: hidden;
}

.scroll-wrapper {
    overflow-x: auto;
}

/* 2. 테이블 기본 스타일 */
.custom-table {
    width: 100%;
    border-collapse: collapse;
}

/* 3. 헤더 스타일 (이전 요청 유지) */
:deep(thead tr) {
    background-color: #3e4771 !important;
}

:deep(th) {
    padding: 16px 24px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff !important;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: 1px solid #27283d;
}

/* 4. 데이터 로우 스타일 (밝은 테마 유지) */
.data-row {
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: #ffffff;

    &:nth-child(even) {
        background-color: #f9f9f9;
    }

    &:hover {
        background-color: #f3f4f6;
    }
}

/* 5. 셀 스타일 */
.cell {
    padding: 16px 24px;
    font-size: 14px;
    color: #374151;
    white-space: nowrap;
    border-bottom: 1px solid #e5e7eb;

    &.id-cell {
        font-weight: 500;
        color: #111827;
        &:hover {
            color: #3b82f6;
        }
    }

    &.action-cell {
        text-align: right;
    }
}

/* 6. 버튼 스타일 */
.action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #9ca3af;
    transition: color 0.2s;
    padding: 4px;

    &.edit:hover {
        color: #3b82f6;
    }
    &.delete:hover {
        color: #ef4444;
    }
}
</style>
