<template>
    <select class="custom-select" @change="(e) => emits('change', e)" :disabled="disabled">
        <option v-if="firstItem" :value="firstItem.value">{{ firstItem.label }}</option>
        <option v-for="item in items" :key="item.value" :value="item.value">
            {{ item.label }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
    items: {
        value: string | number
        label: string
    }[]
    firstItem?: { value?: string | number; label: string }
    disabled?: boolean
}>()
const { items, firstItem, disabled } = toRefs(props)
const emits = defineEmits<{
    (e: 'change', event: Event): void
}>()
</script>

<style scoped lang="scss">
.custom-select {
    @apply w-full px-3 py-2 rounded-lg text-sm pr-8;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500;

    border: 1px solid #d1d5db;
    background-color: white;

    &:disabled {
        @apply bg-gray-100 cursor-not-allowed;
        border-color: #e5e7eb; /* gray-200 (disabled 시 연하게) */
    }
}
</style>
