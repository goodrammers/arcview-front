<template>
    <div class="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        <div class="p-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900" style="font-family: Pacifico, serif">
                Welding
            </h1>
        </div>
        <nav class="flex-1 p-4">
            <ul class="space-y-2">
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap bg-blue-50 text-blue-700"
                    >
                        <i class="ri-home-line text-lg mr-3"></i>
                        홈
                    </button>
                </li>
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50"
                    >
                        <i class="ri-live-line text-lg mr-3"></i>
                        실시간 보기
                    </button>
                </li>
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50"
                    >
                        <i class="ri-tools-line text-lg mr-3"></i>
                        작업 관리
                    </button>
                </li>
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50"
                    >
                        <i class="ri-admin-line text-lg mr-3"></i>
                        관리자 메뉴
                    </button>
                </li>
            </ul>
        </nav>
        <div class="p-4 border-t border-gray-200">
            <button
                class="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
                <i class="ri-logout-box-line text-lg mr-3"></i>
                로그아웃
            </button>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
