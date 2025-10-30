<template>
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <DashboardTableHeader></DashboardTableHeader>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div
                                class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            >
                                251020-105040
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            1호 작업실
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            WM-2000 Pro
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10:50:40</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12:30:15</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            1시간 39분
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
</script>

<style scoped lang="scss"></style>
