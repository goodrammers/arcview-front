<template>
    <div
        class="bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out"
        :class="[isCollapsed ? 'w-20' : 'w-64']"
    >
        <div class="p-6 border-b border-gray-200 flex items-center justify-between h-[88px]">
            <h1
                v-show="!isCollapsed"
                class="text-2xl font-bold text-gray-900 cursor-pointer whitespace-nowrap overflow-hidden transition-opacity duration-200"
                style="font-family: Pacifico, serif"
            >
                ArcVue
            </h1>

            <button
                @click="toggleSidebar"
                class="text-gray-500 hover:text-gray-900 focus:outline-none transition-colors"
                :class="{ 'mx-auto': isCollapsed }"
            >
                <i
                    class="text-xl"
                    :class="isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'"
                ></i>
            </button>
        </div>

        <nav class="flex-1 p-4 overflow-hidden">
            <ul class="space-y-2">
                <li v-for="(item, index) in menuItems" :key="index">
                    <button
                        class="w-full flex items-center p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                        :class="[
                            selectedMenu === index
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-50 text-gray-700',
                            isCollapsed ? 'justify-center' : 'text-left',
                        ]"
                        @click="() => goTo(index)"
                        :title="isCollapsed ? item.label : ''"
                    >
                        <i :class="[item.icon, 'text-xl', isCollapsed ? '' : 'mr-3']"></i>

                        <span v-show="!isCollapsed" class="transition-opacity duration-200">
                            {{ item.label }}
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const selectedMenu = ref(0)
const isCollapsed = ref(false) // 사이드바 토글 상태

// 메뉴 아이템 데이터를 배열로 관리 (가독성 및 유지보수 향상)
const menuItems = [
    { label: '홈', icon: 'ri-home-line', path: '/dashboard' },
    { label: '실시간 보기', icon: 'ri-live-line', path: '/real-time' },
    { label: '작업 관리', icon: 'ri-tools-line', path: '/task' },
    { label: '관리자 메뉴', icon: 'ri-admin-line', path: '/admin' },
]

function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value
}

function goTo(index: number) {
    selectedMenu.value = index
    router.push(menuItems[index].path)
}
</script>

<style scoped lang="scss"></style>
