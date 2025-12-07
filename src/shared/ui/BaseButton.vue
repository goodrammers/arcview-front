<template>
    <!--    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap cursor-pointer"-->
    <button
        class="btn"
        :class="{ 'btn-brand': colored, disabled: disabled, 'flex-grow': flexGrow }"
        @click="() => emits('click')"
        :aria-disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{ colored?: boolean; disabled?: boolean; flexGrow?: boolean }>()
const { colored, disabled, flexGrow } = toRefs(props)

const emits = defineEmits<{
    (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
.btn {
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 16px;
    border: 1px solid rgb(209 213 219);
}
.btn-brand {
    background-color: #3d57bc;
    color: white;
    border: none;
    &.disabled {
        background-color: #5e73c4;
        pointer-events: none;
    }
}
.flex-grow {
    flex: 1;
}
</style>
