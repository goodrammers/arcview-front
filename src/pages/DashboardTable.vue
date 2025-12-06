<template>
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <DashboardTableHeader></DashboardTableHeader>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        class="hover:bg-gray-50 transition-colors"
                        v-for="item in items"
                        :key="item.id"
                        @click="() => onClicked(item.id)"
                    >
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div
                                class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            >
                                {{ item.id }}
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.booth_name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ item.welder_name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ formatStamp(item.start_time) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ formatStamp(item.end_time) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {{ formatDuration(item.start_time, item.end_time) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div class="flex items-center justify-end space-x-2">
                                <button class="text-gray-400 hover:text-blue-600 cursor-pointer">
                                    <i class="ri-edit-line"></i>
                                </button>
                                <button class="text-gray-400 hover:text-red-600 cursor-pointer">
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
import DashboardTableHeader from '@/pages/DashboardTableHeader.vue'
import { type Job } from '@/api/Jobs.ts'
import { toRefs } from 'vue'
import { formatDuration } from '@/Utils/Formatter.ts'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps<{ items: Job[] }>()
const { items } = toRefs(props)

function formatStamp(stamp: number) {
    const date = new Date(stamp / 1000)
    const YYYY = String(date.getFullYear())
    const MM = String(date.getMonth()).padStart(2, '0')
    const DD = String(date.getDate()).padStart(2, '0')

    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')

    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
async function onClicked(id: number) {
    router.push({ path: '/welding-view', query: { id } })
}
</script>

<style scoped lang="scss"></style>
