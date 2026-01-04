<template>
    <div class="container">
        <h2 class="title">{{ mode === 'create' ? 'Add Booth' : 'Edit Booth' }}</h2>

        <div class="form-group">
            <p class="label">Booth Name</p>
            <input
                class="input-field"
                type="text"
                v-model="boothName"
                placeholder="Enter booth name"
            />
        </div>

        <div class="form-group">
            <p class="label">Description</p>
            <textarea
                class="input-field textarea"
                rows="3"
                v-model="description"
                placeholder="Enter description"
            ></textarea>
        </div>

        <div class="form-group">
            <p class="label">Welder (Optional)</p>
            <div class="custom-select-wrapper">
                <select v-model="selectedWelder" class="input-field select-field">
                    <option v-for="welder in welders" :value="welder.id" :key="welder.id">
                        {{ welder.name }}
                    </option>
                </select>
                <div class="select-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <div class="actions">
            <BaseButton flex-grow @click="onCancel" class="cancel-btn">Cancel</BaseButton>
            <BaseButton :disabled="disabled" colored flex-grow @click="onOk">
                {{ mode === 'create' ? 'Create' : 'Update' }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { getWelders, type Welder } from '@/api/Welder.ts'
import { ResultCode } from '@/api/Types.ts'
import { postBooth, putBooth } from '@/api/Booth.ts'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'

const props = defineProps<{ mode: 'create' | 'edit'; boothId: number }>()
const { mode, boothId } = toRefs(props)
const emits = defineEmits<{
    (e: 'close'): void
}>()
const welders = ref<Welder[]>([])
const { booths } = storeToRefs(useTaskItems())
const boothName = ref('')
const description = ref('')
const selectedWelder = ref(-1)
const currentBooth = computed(() => booths.value.find((value) => value.id === boothId.value))

const disabled = computed(() => {
    if (boothName.value === '') {
        return true
    }
    if (mode.value === 'edit' && currentBooth.value) {
        if (boothName.value !== currentBooth.value.name) {
            return false
        }
        if (description.value !== (currentBooth.value.location || '')) {
            return false
        }
        const currentWelders = currentBooth.value.welders
        const currentWelderId = currentWelders.length > 0 ? currentWelders[0].id : -1

        if (selectedWelder.value !== currentWelderId) {
            return false
        }

        return true
    }
    return false
})

async function fetchWelders() {
    // @ts-ignore
    welders.value = [{ id: -1, name: 'Select a welder (Optional)' }]

    if (mode.value === 'edit' && currentBooth.value && currentBooth.value.welders.length > 0) {
        // @ts-ignore
        welders.value.push(currentBooth.value.welders[0])
    }

    const r = await getWelders({ booth_id: -1 })
    if (r.code === ResultCode.SUCCESS && r.data) {
        r.data.forEach((welder) => {
            if (!welders.value.find((w) => w.id === welder.id)) {
                welders.value.push(welder)
            }
        })
    }
}

function onCancel() {
    emits('close')
}
async function onOk() {
    if (boothName.value === '') {
        alert('Please enter a booth name.')
        return
    }
    try {
        if (mode.value === 'create') {
            const r = await postBooth({
                name: boothName.value,
                location: description.value,
                welder_id: selectedWelder.value,
            })
            if (r.code !== ResultCode.SUCCESS) {
                if (r.code === ResultCode.DUPLICATE_DATA) {
                    alert('A booth with this name already exists.')
                } else {
                    alert('Failed to create booth.')
                }
            } else {
                // Success
            }
        } else {
            const r = await putBooth({
                id: currentBooth.value!.id,
                name: boothName.value,
                location: description.value,
                welder_id: selectedWelder.value,
            })
            if (r.code !== ResultCode.SUCCESS) {
                if (r.code === ResultCode.DUPLICATE_DATA) {
                    alert('A booth with this name already exists.')
                } else {
                    alert('Failed to update booth.')
                }
            } else {
                // Success
            }
        }
        await useTaskItems().fetchBooths()
        emits('close')
    } catch (e) {
        console.error(e)
        alert('An error occurred.')
    }
}
function initEditMode() {
    if (mode.value === 'edit' && currentBooth.value) {
        boothName.value = currentBooth.value.name
        description.value = currentBooth.value.location || ''
        if (currentBooth.value.welders.length > 0) {
            selectedWelder.value = currentBooth.value.welders[0].id
        } else {
            selectedWelder.value = -1
        }
    } else {
        selectedWelder.value = -1
    }
}

fetchWelders()
initEditMode()
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-color: #1e293b; /* Slate-800 */
    padding: 24px;
    display: flex;
    flex-direction: column;
    color: #f1f5f9;
}

.title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    color: white;
}

.form-group {
    margin-bottom: 20px;
}

.label {
    color: #94a3b8; /* Slate-400 */
    font-size: 13px;
    margin-bottom: 8px;
    font-weight: 500;
}

.input-field {
    width: 100%;
    padding: 10px 12px;
    background-color: #334155; /* Slate-700 */
    border: 1px solid #475569; /* Slate-600 */
    border-radius: 6px;
    color: white;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;

    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
        color: #64748b;
    }
}

.textarea {
    resize: none;
    min-height: 80px;
}

.custom-select-wrapper {
    position: relative;

    .select-arrow {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
        pointer-events: none;
        color: #94a3b8;

        svg {
            width: 16px;
            height: 16px;
        }
    }
}

.select-field {
    appearance: none;
    cursor: pointer;
    padding-right: 32px;
}

.actions {
    margin-top: auto;
    display: flex;
    gap: 12px;
    padding-top: 24px;
}

:deep(.cancel-btn) {
    background-color: transparent !important;
    border: 1px solid #475569 !important;
    color: #cbd5e1 !important;

    &:hover {
        background-color: #334155 !important;
        color: white !important;
    }
}
</style>
