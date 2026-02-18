<template>
    <thead>
        <tr>
            <th
                v-for="(col, index) in headers"
                :key="index"
                :class="[col.align || 'left', { sortable: !!col.sortKey }]"
                :style="{ width: col.width }"
                @click="col.sortKey && onSort(col.sortKey)"
            >
                <span class="header-content">
                    {{ col.label }}
                    <span v-if="col.sortKey === sortKey" class="sort-indicator">
                        {{ order === 'asc' ? '▲' : '▼' }}
                    </span>
                </span>
            </th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'

defineProps<{
    headers: DataTableHeaderItem[]
    sortKey?: string
    order?: string
}>()

const emit = defineEmits<{
    sort: [sortKey: string]
}>()

function onSort(key: string) {
    emit('sort', key)
}
</script>

<style scoped lang="scss">
thead {
    tr {
        background-color: #3e4771;
    }

    th {
        padding: 16px 24px;
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;

        &.left {
            text-align: left;
        }
        &.center {
            text-align: center;
        }
        &.right {
            text-align: right;
        }

        &.sortable {
            cursor: pointer;
            user-select: none;

            &:hover {
                background-color: #4a5585;
            }
        }
    }
}

.header-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.sort-indicator {
    font-size: 10px;
}
</style>
