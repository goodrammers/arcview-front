<template>
    <div class="container">
        <h2>{{ mode === 'create' ? '작업실 추가' : '작업실 수정' }}</h2>
        <p class="label">작업실 이름</p>
        <input
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="text"
            v-model="boothName"
        />

        <p class="label">설명</p>
        <textarea
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="3"
            v-model="description"
        ></textarea>

        <p class="label">용접기</p>
        <select
            v-model="selectedWelder"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
        >
            <option v-for="welder in welders" :value="welder.id">{{ welder.name }}</option>
        </select>

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
import { computed, ref, toRefs } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import { getWelders, type Welder } from '@/api/Welder.ts'
import { ResultCode } from '@/api/Types.ts'
import { postBooth, putBooth } from '@/api/Booth.ts'
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { type Camera, getCameras } from '@/api/Camera.ts'

const props = defineProps<{ mode: 'create' | 'edit'; boothId: number }>()
const { mode, boothId } = toRefs(props)
const emits = defineEmits<{
    (e: 'close'): void
}>()
const welders = ref<Welder[]>([])
const cameras = ref<Camera[]>([])
const { booths } = storeToRefs(useTaskItems())
const boothName = ref('')
const description = ref('')
const selectedWelder = ref(-1)
const isCameraSelectOpen = ref(false)
const currentBooth = computed(() => booths.value.find((value) => value.id === boothId.value))
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

const disabled = computed(() => {
    if (boothName.value === '') {
        return true
    }
    if (mode.value === 'edit' && currentBooth.value) {
        if (boothName.value !== currentBooth.value.name) {
            return false
        }
        if (description.value !== currentBooth.value.location) {
            return false
        }
        const welders = currentBooth.value.welders
        if (selectedWelder.value >= 0) {
            if (welders.length === 0 || welders[0].id !== selectedWelder.value) {
                return false
            }
        } else if (welders.length > 0) {
            // 취소 하는 경우
            return false
        }
        const cameras = currentBooth.value.cameras
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

async function fetchWelders() {
    // @ts-ignore
    welders.value = [{ id: -1, name: '용접기를 선택해주세요' }]
    if (mode.value === 'edit' && currentBooth.value && currentBooth.value.welders.length > 0) {
        // @ts-ignore
        welders.value.push(currentBooth.value.welders[0])
    }
    const r = await getWelders({ booth_id: -1 })
    if (r.code === ResultCode.SUCCESS && r.data) {
        welders.value.push(...r.data)
    }
}

async function fetchCameras() {
    if (mode.value === 'edit' && currentBooth.value && currentBooth.value.cameras.length > 0) {
        // @ts-ignore
        cameras.value.push(...currentBooth.value.cameras)
    }
    const r = await getCameras({ booth_id: -1 })
    if (r.code === ResultCode.SUCCESS && r.data) {
        cameras.value.push(...r.data)
    }
}

function onCancel() {
    emits('close')
}
async function onOk() {
    if (boothName.value === '') {
        alert('작업실의 이름을 설정하세요')
        return
    }
    if (mode.value === 'create') {
        const r = await postBooth({
            name: boothName.value,
            location: description.value,
            camera_ids: selectedCameras.value,
            welder_id: selectedWelder.value,
        })
        if (r.code !== ResultCode.SUCCESS) {
            if (r.code === ResultCode.DUPLICATE_DATA) {
                alert('같은 이름의 작업실이 이미 존재합니다.')
            } else {
                alert('생성에 실패하였습니다.')
            }
        } else {
            alert(boothName.value + '가 생성되었습니다.')
        }
    } else {
        const r = await putBooth({
            id: currentBooth.value!.id,
            name: boothName.value,
            location: description.value,
            camera_ids: selectedCameras.value,
            welder_id: selectedWelder.value,
        })
        if (r.code !== ResultCode.SUCCESS) {
            if (r.code === ResultCode.DUPLICATE_DATA) {
                alert('같은 이름의 작업실이 이미 존재합니다.')
            } else {
                alert('수정에 실패하였습니다.')
            }
        } else {
            alert(boothName.value + '가 수정되었습니다.')
        }
    }
    await useTaskItems().fetchBooths()
    emits('close')
}
function initEditMode() {
    if (mode.value === 'edit' && currentBooth.value) {
        boothName.value = currentBooth.value.name
        description.value = currentBooth.value.location
        if (currentBooth.value.welders.length > 0) {
            selectedWelder.value = currentBooth.value.welders[0].id
        }
        selectedCameras.value = currentBooth.value.cameras.map((value) => value.id)
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
fetchWelders()
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
