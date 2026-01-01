<template>
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
        <div class="sidebar-header">
            <div class="logo-area">
                <h1 class="logo-text">ArcSync</h1>
            </div>

            <button class="toggle-btn" @click="toggleSidebar">
                <i
                    class="text-xl"
                    :class="isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'"
                ></i>
            </button>
        </div>

        <nav class="sidebar-nav">
            <ul class="menu-list">
                <li v-for="(item, index) in menuItems" :key="index">
                    <button
                        class="menu-item"
                        :class="{ active: selectedMenu === index }"
                        @click="() => goTo(index)"
                        :title="isCollapsed ? item.label : ''"
                    >
                        <i :class="item.icon" class="menu-icon"></i>
                        <span class="menu-label">{{ item.label }}</span>
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
const isCollapsed = ref(false)

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

<style scoped lang="scss">
/* 변수 정의 */
$bg-color: #130f1d;
$border-color: #2a2636;
$text-default: #d9d9d9;
$text-active: #ffffff;
$hover-bg: #2a2636;
$width-expanded: 256px; /* w-64 */
$width-collapsed: 80px; /* w-20 */
$transition-speed: 0.3s;

.sidebar {
    background-color: $bg-color;
    border-right: 1px solid $border-color;
    height: 100vh;
    display: flex;
    flex-direction: column;
    width: $width-expanded;
    transition: width $transition-speed ease-in-out;
    overflow: hidden;

    /* 닫혔을 때 스타일 오버라이드 */
    &.collapsed {
        width: $width-collapsed;

        .sidebar-header {
            justify-content: center;
        }

        .logo-area {
            width: 0;
            opacity: 0;
            margin: 0;
        }

        .menu-item {
            justify-content: center;
            padding-left: 0;
            padding-right: 0;
        }

        .menu-icon {
            margin-right: 0;
        }

        .menu-label {
            max-width: 0;
            opacity: 0;
        }
    }
}

/* --- Header --- */
.sidebar-header {
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $border-color;
    padding: 0 24px;
    transition: all $transition-speed;
    white-space: nowrap;
}

.logo-area {
    overflow: hidden;
    width: auto;
    opacity: 1;
    transition: all $transition-speed;
    transform-origin: left;
}

.logo-text {
    font-family: 'Pacifico', serif;
    font-size: 24px; /* text-2xl */
    font-weight: 700;
    color: $text-default;
    cursor: pointer;
    margin: 0;
}

.toggle-btn {
    padding: 8px;
    border-radius: 8px;
    color: $text-default;
    background: transparent;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    transition:
        background-color 0.2s,
        color 0.2s;

    &:hover {
        background-color: $hover-bg;
        color: $text-active;
    }

    i {
        font-size: 20px;
        display: block; /* 아이콘 수직 정렬 보정 */
    }
}

/* --- Navigation --- */
.sidebar-nav {
    flex: 1;
    padding: 16px;
    overflow: hidden;
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.menu-item {
    width: 100%;
    display: flex;
    align-items: center;
    text-align: left;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    background: transparent;
    color: $text-default;
    transition:
        background-color 0.2s,
        color 0.2s;
    white-space: nowrap;

    /* Hover */
    &:hover {
        background-color: $hover-bg;
        color: $text-active;
    }

    /* Active (Selected) */
    &.active {
        background-color: $hover-bg;
        color: $text-active;
    }
}

.menu-icon {
    font-size: 20px; /* text-xl */
    flex-shrink: 0;
    margin-right: 12px;
    transition: margin-right $transition-speed;
}

.menu-label {
    overflow: hidden;
    max-width: 160px; /* 충분한 너비 */
    opacity: 1;
    transition:
        max-width $transition-speed ease-in-out,
        opacity $transition-speed ease-in-out;
    transform-origin: left;
}
</style>
