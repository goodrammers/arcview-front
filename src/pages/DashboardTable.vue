<template>
    <div class="table-container">
        <div class="scroll-wrapper">
            <table class="custom-table">
                <DataTableHeader
                    :headers="tableHeaders"
                    :sort-key="sortKey"
                    :order="order"
                    @sort="onHeaderSort"
                />

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

        <!-- Pagination -->
        <div v-if="totalPage > 0" class="pagination-bar">
            <span class="pagination-info">
                Total {{ totalCount }} items
            </span>
            <div class="pagination-controls">
                <button
                    class="page-btn"
                    :disabled="page <= 1"
                    @click="emit('update:page', page - 1)"
                >
                    <i class="ri-arrow-left-s-line"></i>
                </button>

                <button
                    v-for="p in visiblePages"
                    :key="p"
                    class="page-btn"
                    :class="{ active: p === page }"
                    @click="emit('update:page', p)"
                >
                    {{ p }}
                </button>

                <button
                    class="page-btn"
                    :disabled="page >= totalPage"
                    @click="emit('update:page', page + 1)"
                >
                    <i class="ri-arrow-right-s-line"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { type Job } from '@/api/Jobs.ts'
import { formatDuration } from '@/Utils/Formatter.ts'
import { DataTableHeader } from '@/widgets/data-table'
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'

const router = useRouter()

const props = defineProps<{
    items: Job[]
    page: number
    totalPage: number
    totalCount: number
    sortKey: string
    order: string
}>()
const { items, page, totalPage } = toRefs(props)

const emit = defineEmits<{
    'update:page': [page: number]
    'update:sort': [payload: { sortKey: string; order: 'asc' | 'desc' }]
}>()

const tableHeaders: DataTableHeaderItem[] = [
    { label: 'ID', sortKey: 'id' },
    { label: 'Booth', sortKey: 'booth_name' },
    { label: 'Welding Unit', sortKey: 'welder_id' },
    { label: 'Camera1' },
    { label: 'Camera2' },
    { label: 'Start Time', sortKey: 'start_time' },
    { label: 'End Time', sortKey: 'end_time' },
    { label: 'Duration' },
    { label: 'Action', align: 'right' },
]

const visiblePages = computed(() => {
    const total = totalPage.value
    const current = page.value
    const pages: number[] = []

    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)

    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(total, start + 4)
        } else {
            start = Math.max(1, end - 4)
        }
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

function onHeaderSort(key: string) {
    if (props.sortKey === key) {
        emit('update:sort', {
            sortKey: key,
            order: props.order === 'asc' ? 'desc' : 'asc',
        })
    } else {
        emit('update:sort', { sortKey: key, order: 'desc' })
    }
}

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

/* 3. 헤더 스타일 */
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

/* 4. 데이터 로우 스타일 */
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

/* 7. 페이지네이션 */
.pagination-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-top: 1px solid #3e4771;
}

.pagination-info {
    font-size: 13px;
    color: #9ca3af;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 4px;
}

.page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #3e4771;
    border-radius: 6px;
    background: transparent;
    color: #9ca3af;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled):not(.active) {
        background-color: #3e4771;
        color: #ffffff;
    }

    &.active {
        background-color: #3b82f6;
        border-color: #3b82f6;
        color: #ffffff;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}
</style>
