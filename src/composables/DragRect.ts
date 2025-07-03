import { onMounted, onUnmounted, ref } from 'vue'

export function useDragRect() {
    const parentEl = ref<HTMLElement | null>(null)
    let rectEl: HTMLElement | null = null
    let startX = 0
    let startY = 0
    let currentX = 0
    let currentY = 0
    const dragging = ref(false)
    const rect = ref<{ top: number; left: number; width: number; height: number }>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    })

    let customMouseUp: null | (() => void) = null
    function setCustomMouseUp(fn: () => void) {
        customMouseUp = fn
    }

    function setStyle() {
        if (rectEl) {
            rectEl.style.position = 'absolute'
            rectEl.style.border = '2px dashed red'
            rectEl.style.backgroundColor = 'rgba(0, 0, 0, 0)'
            rectEl.style.userSelect = 'none'
        }
    }

    onMounted(() => {
        if (parentEl.value) {
            rectEl = document.createElement('div')
            setStyle()
            parentEl.value.addEventListener('mousedown', onMouseDown)
            parentEl.value.addEventListener('mousemove', onMouseMove)
            parentEl.value.addEventListener('mouseup', onMouseUp)
            parentEl.value.appendChild(rectEl)
            parentEl.value.style.position = 'relative'
        }
    })
    onUnmounted(() => {
        if (parentEl.value && rectEl && rectEl.parentNode) {
            parentEl.value.removeEventListener('mousedown', onMouseDown)
            parentEl.value.removeEventListener('mousemove', onMouseMove)
            parentEl.value.removeEventListener('mouseup', onMouseUp)
            rectEl.parentNode.removeChild(rectEl)
        }
    })

    function setGeometry(top: number, left: number, width: number, height: number) {
        rect.value = { top, left, width, height }
        if (rectEl) {
            rectEl.style.top = top + 'px'
            rectEl.style.left = left + 'px'
            rectEl.style.width = width + 'px'
            rectEl.style.height = height + 'px'
        }
    }

    function onMouseDown(e: MouseEvent) {
        setGeometry(-1, -3000, 0, 0)
        const target = e.currentTarget as HTMLElement
        if (!target) {
            return
        }

        const rect = target.getBoundingClientRect()
        startX = e.clientX - rect.left
        startY = e.clientY - rect.top
        currentX = startX
        currentY = startY
        dragging.value = true
    }

    function onMouseMove(e: MouseEvent) {
        if (!dragging.value) {
            return
        }
        const isMouseDown = e.buttons === 1
        if (!isMouseDown) {
            dragging.value = false
            return
        }

        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        currentX = e.clientX - rect.left
        currentY = e.clientY - rect.top

        const width = Math.abs(currentX - startX)
        const height = Math.abs(currentY - startY)

        setGeometry(Math.min(startY, currentY), Math.min(startX, currentX), width, height)
    }

    function onMouseUp() {
        dragging.value = false
        if (customMouseUp) {
            customMouseUp()
        }
    }
    return {
        el: parentEl,
        rect,

        setCustomMouseUp,
    }
}
