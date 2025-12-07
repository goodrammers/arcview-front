<template>
    <div class="container">
        <h2>{{ mode === 'create' ? '용접기 추가' : '용접기 수정' }}</h2>
        <p class="label">용접기 이름</p>
        <input
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="text"
            v-model="welderName"
        />

        <p class="label">설명</p>
        <textarea
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="3"
            v-model="description"
        ></textarea>

        <p class="label">IP</p>
        <input
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="text"
            v-model="ipAddress"
        />

        <!-- 카메라 -->
        <p class="label">카메라</p>
        <div
            @click="isCameraSelectOpen = !isCameraSelectOpen"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between min-h-[42px]"
            :class="{ 'ring-2 ring-blue-500 border-blue-500': isCameraSelectOpen }"
        >
            <span class="text-sm text-gray-900 truncate select-none">
                {{ selectedCameraText }}
            </span>

            <svg
                class="w-4 h-4 text-gray-500 transition-transform"
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

        <div
            v-if="isCameraSelectOpen"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
            <div
                v-for="camera in cameras"
                :key="camera.id"
                class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                @click.stop="toggleCameraSelection(camera.id)"
            >
                <input
                    type="checkbox"
                    :checked="selectedCameras.includes(camera.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                />
                <span class="ml-2 text-sm text-gray-700 select-none">
                    {{ camera.name }}
                </span>
            </div>

            <div v-if="cameras.length === 0" class="px-3 py-2 text-sm text-gray-500">
                선택 가능한 카메라가 없습니다.
            </div>
        </div>

        <div
            v-if="isCameraSelectOpen"
            @click="isCameraSelectOpen = false"
            class="fixed inset-0 z-0 bg-transparent cursor-default"
        ></div>

        <div class="actions">
            <BaseButton flex-grow @click="onCancel">취소</BaseButton>
            <BaseButton :disabled="disabled" colored flex-grow @click="onOk">
                {{ mode === 'create' ? '추가' : '수정' }}
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
        return '카메라를 선택하세요'
    }

    // 선택된 ID에 해당하는 이름을 찾아서 콤마로 연결

    if (cameras.value.length === 0) {
        return ''
    }
    const c = cameras.value.filter((value) => selectedCameras.value.includes(value.id))
    return c.map((value) => value.name).join(',')
})
const currentWelder = computed(() => welders.value.find((value) => value.id === welderId.value))
const disabled = computed(() => {
    if (welderName.value === '' || ipAddress.value === '') {
        return true
    }
    if (mode.value === 'edit' && currentWelder.value) {
        if (welderName.value !== currentWelder.value.name) {
            return false
        }
        if (description.value !== currentWelder.value.description) {
            return false
        }
        if (ipAddress.value !== currentWelder.value.ip_address) {
            return false
        }
        const cameras = currentWelder.value.cameras
        if (selectedCameras.value.length !== cameras.length) {
            return false
        } else {
            let diff = false
            selectedCameras.value.forEach((value) => {
                if (!cameras.find((c) => c.id === value)) {
                    diff = true
                }
            })
            if (diff) {
                return false
            }
        }

        return true
    }
    return false
})

async function fetchCameras() {
    if (mode.value === 'edit' && currentWelder.value && currentWelder.value.cameras.length > 0) {
        // @ts-ignore
        cameras.value.push(...currentWelder.value.cameras)
    }
    const r = await getCameras({ welder_id: -1 })
    if (r.code === ResultCode.SUCCESS && r.data) {
        cameras.value.push(...r.data)
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
    if (mode.value === 'create') {
        const r = await postWelder({
            booth_id: -1,
            camera_ids: selectedCameras.value,
            description: description.value,
            ip_address: ipAddress.value,
            name: welderName.value,
        })
        if (r.code !== ResultCode.SUCCESS) {
            alert('용접기 생성에 실패하였습니다.')
        } else {
            alert('용접기가 생성되었습니다.')
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
            alert('용접기 수정에 실패하였습니다.')
        } else {
            alert('용접기가 수정되었습니다.')
        }
    }
    await useTaskItems().fetchWelders()
    emits('close')
}

fetchCameras()
initEditMode()
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 16px;

    h2 {
        font-weight: 600;
    }
    .label {
        color: rgb(55 65 81);
        font-size: 14px;
        margin-bottom: 2px;
        margin-top: 14px;
    }
    .actions {
        display: flex;
        width: 100%;
        gap: 10px;
        margin-top: 40px;
    }
}
</style>
