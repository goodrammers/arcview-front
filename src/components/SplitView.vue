<template>
    <div
        class="outer-container"
        ref="outerContainerRef"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
    >
        <div class="four-quadrant-layout" :style="gridTemplateStyle">
            <div class="quadrant quadrant-top-left">
                <slot name="topLeft">
                    <div>선택된 뷰가 없습니다.</div>
                </slot>
            </div>
            <div class="quadrant quadrant-top-right">
                <slot name="topRight">
                    <div>선택된 뷰가 없습니다.</div>
                </slot>
            </div>
            <div class="quadrant quadrant-bottom-left">
                <slot name="bottomLeft">
                    <div>선택된 뷰가 없습니다.</div>
                </slot>
            </div>
            <div class="quadrant quadrant-bottom-right">
                <slot name="bottomRight">
                    <div>선택된 뷰가 없습니다.</div>
                </slot>
            </div>
        </div>

        <div
            class="resizer vertical-resizer-overlay"
            :style="{ left: `${col1Width}%` }"
            @mousedown="startDragging($event, 'vertical')"
        ></div>

        <div
            class="resizer horizontal-resizer-overlay"
            :style="{ top: `${row1Height}%` }"
            @mousedown="startDragging($event, 'horizontal')"
        ></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'

const outerContainerRef = ref<HTMLElement | null>(null)
const col1Width = ref(50) // 왼쪽 열의 너비
const row1Height = ref(50) // 상단 행의 높이

// 드래그 중인 리사이저의 종류 'horizontal', 'vertical'
const draggingType = ref<string | null>(null)

// 드래그 시작 시 마우스 위치
const startX = ref(0)
const startY = ref(0)

// 드래그 시작 시 각 패널의 초기 크기 (퍼센트)
const initialCol1WidthPercent = ref(0)
const initialRow1HeightPercent = ref(0)

const gridTemplateStyle = computed(() => ({
    gridTemplateColumns: `${col1Width.value}% ${100 - col1Width.value}%`,
    gridTemplateRows: `${row1Height.value}% ${100 - row1Height.value}%`,
}))

// 드래그 시작 이벤트 핸들러
const startDragging = (event: MouseEvent, type: string) => {
    if (!outerContainerRef.value) return

    draggingType.value = type
    startX.value = event.clientX
    startY.value = event.clientY

    // 드래그 시작 시 현재 패널의 퍼센트 크기를 저장
    initialCol1WidthPercent.value = col1Width.value
    initialRow1HeightPercent.value = row1Height.value

    // 전체 문서에 이벤트 리스너 추가하여 마우스가 리사이저 밖으로 나가도 드래그가 유지되도록
    window.addEventListener('mousemove', doDragging)
    window.addEventListener('mouseup', stopDragging)

    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = 'none'
    document.body.style.cursor = type === 'vertical' ? 'ew-resize' : 'ns-resize'
}

function doDragging(event: MouseEvent) {
    if (!draggingType.value || !outerContainerRef.value) {
        return
    }

    const containerWidth = outerContainerRef.value.offsetWidth
    const containerHeight = outerContainerRef.value.offsetHeight

    if (containerWidth === 0 || containerHeight === 0) {
        return
    }

    const dx = event.clientX - startX.value
    const dy = event.clientY - startY.value

    const MIN_SIZE_PERCENT = 10 // 최소 크기 퍼센트
    const MAX_SIZE_PERCENT = 90 // 최대 크기 퍼센트

    if (draggingType.value === 'horizontal') {
        // 수평 리사이저 드래그 (세로 크기 조절)
        const deltaHeightPercent = (dy / containerHeight) * 100
        let newHeightPercent = initialRow1HeightPercent.value + deltaHeightPercent

        // 최소/최대 크기 제한
        newHeightPercent = Math.max(MIN_SIZE_PERCENT, Math.min(MAX_SIZE_PERCENT, newHeightPercent))
        row1Height.value = newHeightPercent
    } else if (draggingType.value === 'vertical') {
        // 수직 리사이저 드래그 (가로 크기 조절)
        const deltaWidthPercent = (dx / containerWidth) * 100
        let newWidthPercent = initialCol1WidthPercent.value + deltaWidthPercent

        // 최소/최대 크기 제한
        newWidthPercent = Math.max(MIN_SIZE_PERCENT, Math.min(MAX_SIZE_PERCENT, newWidthPercent))
        col1Width.value = newWidthPercent
    }
}

function stopDragging() {
    if (!draggingType.value) {
        return
    }

    draggingType.value = null
    cleanUp()
}
function cleanUp() {
    window.removeEventListener('mousemove', doDragging)
    window.removeEventListener('mouseup', stopDragging)

    // 드래그 종료 시 텍스트 선택 및 커서 복원
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
}

onUnmounted(() => {
    cleanUp()
})
</script>

<style scoped lang="scss">
.outer-container {
    position: relative; /* 자식 absolute 요소의 기준점 */
    width: 100%;
    height: 100vh; /* 예시: 뷰포트 전체 높이를 사용. 부모 컨테이너에 맞게 조절 가능. */
    border: 1px solid #ccc;
    overflow: hidden; /* 내용이 넘치거나 리사이저가 삐져나가지 않도록 */
    box-sizing: border-box;
}

.four-quadrant-layout {
    display: grid;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.quadrant {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
    box-sizing: border-box;
}

//리사이저 오버레이 스타일
.resizer {
    position: absolute;
    background-color: #a0a0a0;
    z-index: 10; /* 사분면 위에 표시 */
    transition: background-color 0.2s ease;
}

.resizer:hover {
    background-color: #777;
    transform: scale(2);
}

/* 수직 리사이저 (세로선) */
.vertical-resizer-overlay {
    cursor: ew-resize;
    top: 0;
    bottom: 0;
    width: 2px;

    // 중앙 정렬 (너비의 절반만큼 왼쪽으로)
    margin-left: -1px;
}

/* 수평 리사이저 (가로선) */
.horizontal-resizer-overlay {
    cursor: ns-resize; /* 상하 크기 조절 커서 */

    // 부모 너비를 꽉 채움
    left: 0;
    right: 0;

    height: 2px;
    // 중앙 정렬 (높이의 절반만큼 위로)
    margin-top: -1px;
}
</style>
