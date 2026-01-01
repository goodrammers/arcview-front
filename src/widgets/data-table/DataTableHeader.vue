<template>
    <thead>
        <tr>
            <th
                v-for="(col, index) in headers"
                :key="index"
                :class="col.align || 'left'"
                :style="{ width: col.width }"
            >
                {{ col.label }}
            </th>
        </tr>
    </thead>
</template>

<script setup lang="ts">
import type { DataTableHeaderItem } from '@/widgets/data-table/Types.ts'

defineProps<{
    headers: DataTableHeaderItem[]
}>()
</script>

<style scoped lang="scss">
thead {
    tr {
        background-color: #3e4771; // 요청하신 배경색
    }

    th {
        padding: 16px 24px; // px-6 py-4 대응
        color: #ffffff; // 어두운 배경이므로 글자색은 흰색으로 변경 (기존 text-gray-500 제거)
        font-size: 12px; // text-xs 대응
        font-weight: 500; // font-medium 대응
        text-transform: uppercase; // uppercase 대응
        letter-spacing: 0.05em; // tracking-wider 대응
        white-space: nowrap; // 줄바꿈 방지

        // 정렬 클래스
        &.left {
            text-align: left;
        }
        &.center {
            text-align: center;
        }
        &.right {
            text-align: right;
        }
    }
}
</style>
