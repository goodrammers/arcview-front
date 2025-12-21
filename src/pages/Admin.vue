<template>
    <div class="page-container">
        <div class="content-wrapper">
            <div class="header-section">
                <h1 class="page-title">관리자 메뉴</h1>
            </div>

            <h2 class="section-title">서비스 포트 설정</h2>
            <div class="section-wrapper">
                <div class="config-card">
                    <div class="input-group">
                        <div class="input-field">
                            <label class="input-label">포트 번호</label>
                            <input
                                class="text-input"
                                placeholder="포트 번호를 입력하세요"
                                type="number"
                                v-model="update.port"
                            />
                        </div>
                        <button class="action-btn" @click="setPort">적용</button>
                    </div>
                </div>
            </div>

            <h2 class="section-title mt-10">동영상 디렉토리 설정</h2>
            <div class="section-wrapper">
                <div class="config-card">
                    <div class="input-group">
                        <div class="input-field">
                            <label class="input-label">동영상 디렉토리</label>
                            <input
                                class="text-input"
                                placeholder="디텍토리를 선택하세요"
                                v-model="update.dir"
                            />
                        </div>
                        <button class="action-btn" @click="setDirectory">적용</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getServicePort, getVideoDir, putServicePort, putVideoDir } from '@/api/Config.ts'
import { ref } from 'vue'
import { ResultCode } from '@/api/Types.ts'

const model = ref({
    port: 0,
    dir: '',
})

const update = ref({
    port: 0,
    dir: '',
})

async function fetch() {
    const p = await getServicePort()
    if (p.code === ResultCode.SUCCESS && p.data) {
        model.value.port = p.data.port
    } else {
        model.value.port = 0
    }
    const v = await getVideoDir()
    if (v.code === ResultCode.SUCCESS && v.data) {
        model.value.dir = v.data.directory
    } else {
        model.value.dir = ''
    }
    update.value = { ...model.value }
}

async function setPort() {
    if (update.value.port !== model.value.port) {
        await putServicePort({ port: update.value.port })
        await fetch()
    }
}

async function setDirectory() {
    if (update.value.dir !== model.value.dir) {
        await putVideoDir({ directory: update.value.dir })
        await fetch()
    }
}
fetch()
</script>

<style scoped lang="scss">
.page-container {
    flex: 1;
    overflow: auto;
    background-color: #27283d;
}

.content-wrapper {
    padding: 24px;
}

/* 헤더 스타일 */
.header-section {
    margin-bottom: 32px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
}

/* 섹션 공통 스타일 */
.section-wrapper {
    background-color: white;
    color: #333;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin: 0 0 24px 0;
}

/* 설정 카드 스타일 */
.config-card {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-group {
    display: flex;
    align-items: flex-end;
    gap: 16px;
}

.input-field {
    flex: 1;
}

.input-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.text-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box; /* 패딩 포함 너비 계산 */

    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
        color: #9ca3af;
    }
}

/* 버튼 스타일 */
.action-btn {
    padding: 8px 24px;
    background-color: #3e4771;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s;
}
</style>
