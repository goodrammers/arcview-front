<template>
    <div class="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
        <div class="p-6 border-b border-gray-200">
            <h1
                class="text-2xl font-bold text-gray-900 cursor-pointer"
                style="font-family: Pacifico, serif"
            >
                Welding
            </h1>
        </div>
        <nav class="flex-1 p-4">
            <ul class="space-y-2">
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-blue-700"
                        :class="[selectedMenu === 0 ? 'bg-blue-50' : 'hover:bg-gray-50']"
                        @click="() => goTo(0)"
                    >
                        <i class="ri-home-line text-lg mr-3"></i>
                        홈
                    </button>
                </li>
                <li>
                    <button
                        @click="() => goTo(1)"
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700"
                        :class="[selectedMenu === 1 ? 'bg-blue-50' : 'hover:bg-gray-50']"
                    >
                        <i class="ri-live-line text-lg mr-3"></i>
                        실시간 보기
                    </button>
                </li>
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700"
                        :class="[selectedMenu === 2 ? 'bg-blue-50' : 'hover:bg-gray-50']"
                        @click="() => goTo(2)"
                    >
                        <i class="ri-tools-line text-lg mr-3"></i>
                        작업 관리
                    </button>
                </li>
                <li>
                    <button
                        class="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors cursor-pointer whitespace-nowrap text-gray-700"
                        :class="[selectedMenu === 3 ? 'bg-blue-50' : 'hover:bg-gray-50']"
                        @click="() => goTo(3)"
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

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const selectedMenu = ref(0)

function goTo(index: number) {
    selectedMenu.value = index
    const routePath = ['/home/dashboard', '/home/real-time', '', '']
    router.push(routePath[index])
}
</script>

<style scoped lang="scss"></style>
