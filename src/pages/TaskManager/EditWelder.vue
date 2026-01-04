<template>
    <div class="container">
        <h2 class="title">{{ mode === 'create' ? 'Add Welder' : 'Edit Welder' }}</h2>

        <div class="form-group">
            <p class="label">Welder Name</p>
            <input
                class="input-field"
                type="text"
                v-model="welderName"
                placeholder="Enter welder name"
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
            <p class="label">IP Address</p>
            <input class="input-field" type="text" v-model="ipAddress" placeholder="0.0.0.0" />
        </div>

        <!-- Camera Select -->
        <div class="form-group">
            <p class="label">Cameras</p>
            <div
                @click="isCameraSelectOpen = !isCameraSelectOpen"
                class="custom-select"
                :class="{ 'is-open': isCameraSelectOpen }"
            >
                <span class="select-text" :class="{ placeholder: selectedCameras.length === 0 }">
                    {{ selectedCameraText }}
                </span>

                <svg
                    class="chevron-icon"
                    :class="{ 'rotate-180': isCameraSelectOpen }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            <!-- Dropdown Menu -->
            <div v-if="isCameraSelectOpen" class="dropdown-menu" @click.stop>
                <div
                    v-for="camera in cameras"
                    :key="camera.id"
                    class="dropdown-item"
                    @click="toggleCameraSelection(camera.id)"
                >
                    <input
                        type="checkbox"
                        :checked="selectedCameras.includes(camera.id)"
                        class="checkbox"
                    />
                    <span class="item-text">
                        {{ camera.name }}
                    </span>
                </div>

                <div v-if="cameras.length === 0" class="empty-dropdown">No cameras available</div>
            </div>
        </div>

        <!-- Overlay for closing dropdown -->
        <div
            v-if="isCameraSelectOpen"
            @click="isCameraSelectOpen = false"
            class="dropdown-overlay"
        ></div>

        <div class="actions">
            <BaseButton flex-grow @click="onCancel" class="cancel-btn">Cancel</BaseButton>
            <BaseButton :disabled="disabled" colored flex-grow @click="onOk">
                {{ mode === 'create' ? 'Create' : 'Update' }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'
import { computed, ref, toRefs } from 'vue'
import { type Camera, getCameras } from '@/api/Camera.ts'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { ResultCode } from '@/api/Types.ts'
import { postWelder, putWelder } from '@/api/Welder.ts'

const props = defineProps<{ mode: 'create' | 'edit'; welderId: number }>()
const emits = defineEmits<{
    (e: 'close'): void
}>()
const { mode, welderId } = toRefs(props)
const welderName = ref('')
const description = ref('')
const ipAddress = ref('')
const { welders } = storeToRefs(useTaskItems())
const isCameraSelectOpen = ref(false)
const cameras = ref<Camera[]>([])
const selectedCameras = ref<number[]>([])

const selectedCameraText = computed(() => {
    if (selectedCameras.value.length === 0) {
        return 'Select Cameras'
    }

    if (cameras.value.length === 0) {
        return ''
    }
    const c = cameras.value.filter((value) => selectedCameras.value.includes(value.id))
    return c.map((value) => value.name).join(', ')
})

const currentWelder = computed(() => welders.value.find((value) => value.id === welderId.value))

const disabled = computed(() => {
    if (welderName.value === '' || ipAddress.value === '') {
        return true
    }
    if (mode.value === 'edit' && currentWelder.value) {
        // Check if there are any changes
        const hasNameChanged = welderName.value !== currentWelder.value.name
        const hasDescChanged = description.value !== (currentWelder.value.description || '')
        const hasIpChanged = ipAddress.value !== currentWelder.value.ip_address

        const originalCameraIds = currentWelder.value.cameras
            .map((c) => c.id)
            .sort()
            .join(',')
        const newCameraIds = [...selectedCameras.value].sort().join(',')
        const hasCamerasChanged = originalCameraIds !== newCameraIds

        return !(hasNameChanged || hasDescChanged || hasIpChanged || hasCamerasChanged)
    }
    return false
})

async function fetchCameras() {
    // If editing, preload existing cameras
    if (mode.value === 'edit' && currentWelder.value && currentWelder.value.cameras.length > 0) {
        // Avoid duplicates if fetchCameras is called multiple times or data overlaps
        // But here we just want to ensure the list is populated.
        // We will fetch ALL available cameras from server, and currentWelder.cameras just helps with selection state logic if needed,
        // but actually we need the full list to select from.
        // The previous logic pushed welder cameras to options, which might be duplicates if we fetch all.
        // Let's just fetch all cameras.
    }

    // Fetch all available cameras (freed or compatible)
    // Note: Depends on backend logic. Assuming getCameras({ welder_id: -1 }) returns unassigned cameras.
    // If we are editing, we should also include the cameras currently assigned to THIS welder.
    const r = await getCameras({ welder_id: -1 })

    // Start with currently assigned cameras if editing
    const currentCameras =
        mode.value === 'edit' && currentWelder.value ? currentWelder.value.cameras : []

    if (r.code === ResultCode.SUCCESS && r.data) {
        // Combine current cameras + available cameras, removing duplicates by ID
        const allCameras = [...currentCameras, ...r.data]
        // Deduplicate
        const uniqueCameras = Array.from(
            new Map(allCameras.map((item) => [item.id, item])).values()
        )
        cameras.value = uniqueCameras
    } else {
        cameras.value = currentCameras
    }
}

function toggleCameraSelection(id: number) {
    const index = selectedCameras.value.indexOf(id)
    if (index === -1) {
        selectedCameras.value.push(id)
    } else {
        selectedCameras.value.splice(index, 1)
    }
}

function initEditMode() {
    if (mode.value === 'edit' && currentWelder.value) {
        const w = currentWelder.value
        welderName.value = w.name
        description.value = w.description || ''
        ipAddress.value = w.ip_address
        selectedCameras.value = w.cameras.map((value) => value.id)
    }
}

function onCancel() {
    emits('close')
}

async function onOk() {
    try {
        if (mode.value === 'create') {
            const r = await postWelder({
                booth_id: -1, // Default or unassigned
                camera_ids: selectedCameras.value,
                description: description.value,
                ip_address: ipAddress.value,
                name: welderName.value,
            })
            if (r.code !== ResultCode.SUCCESS) {
                alert('Failed to create welder.')
            } else {
                // Success
            }
        } else if (currentWelder.value) {
            const r = await putWelder({
                id: currentWelder.value.id,
                booth_id: currentWelder.value.booth_id,
                camera_ids: selectedCameras.value,
                description: description.value,
                ip_address: ipAddress.value,
                name: welderName.value,
            })
            if (r.code !== ResultCode.SUCCESS) {
                alert('Failed to update welder.')
            } else {
                // Success
            }
        }
        await useTaskItems().fetchWelders()
        emits('close')
    } catch (e) {
        console.error(e)
        alert('An error occurred.')
    }
}

// Initialize
fetchCameras()
initEditMode()
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-color: #1e293b; /* Dark Slate Background */
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
    margin-bottom: 16px;
    position: relative;
}

.label {
    color: #94a3b8; /* Slate-400 */
    font-size: 13px;
    margin-bottom: 6px;
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
        border-color: #3b82f6; /* Blue-500 */
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    &::placeholder {
        color: #64748b;
    }
}

.textarea {
    resize: none;
}

/* Custom Select */
.custom-select {
    width: 100%;
    padding: 10px 12px;
    background-color: #334155;
    border: 1px solid #475569;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 42px;
    transition: all 0.2s;

    &.is-open {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
}

.select-text {
    font-size: 14px;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.placeholder {
        color: #64748b;
    }
}

.chevron-icon {
    width: 16px;
    height: 16px;
    color: #94a3b8;
    transition: transform 0.2s;
    flex-shrink: 0;
    margin-left: 8px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 4px;
    background-color: #334155;
    border: 1px solid #475569;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    max-height: 200px;
    overflow-y: auto;
    z-index: 50;

    /* Scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #475569;
        border-radius: 3px;
    }
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.1s;

    &:hover {
        background-color: #475569;
    }
}

.checkbox {
    width: 16px;
    height: 16px;
    accent-color: #3b82f6;
    margin-right: 8px;
    cursor: pointer;
}

.item-text {
    font-size: 14px;
    color: #e2e8f0;
}

.empty-dropdown {
    padding: 12px;
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
}

.dropdown-overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    cursor: default;
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
