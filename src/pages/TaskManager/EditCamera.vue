<template>
    <div class="container">
        <h2>{{ mode === 'create' ? '카메라 추가' : '카메라 수정' }}</h2>
        <p class="label">작업실 이름</p>
        <input
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="text"
            v-model="cameraName"
        />

        <p class="label">Video Port</p>
        <input
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            type="number"
            v-model="videoPort"
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
import { storeToRefs } from 'pinia'
import { useTaskItems } from '@/pages/TaskManager/TaskItems.ts'
import { patchCamera, postCamera } from '@/api/Camera.ts'

const props = defineProps<{ mode: 'create' | 'edit'; cameraId: number }>()
const { mode, cameraId } = toRefs(props)
const emits = defineEmits<{
    (e: 'close'): void
}>()
const { cameras } = storeToRefs(useTaskItems())
const cameraName = ref('')
const videoPort = ref(0)
const description = ref('')
const selectedWelder = ref(-1)
const currentCamera = computed(() => cameras.value.find((value) => value.id === cameraId.value))
const welders = ref<Welder[]>([])

const disabled = computed(() => cameraName.value === '')

async function fetchWelders() {
    // @ts-ignore
    welders.value = [{ id: -1, name: '용접기를 선택해주세요' }]
    const r = await getWelders()
    if (r.code === ResultCode.SUCCESS && r.data) {
        welders.value.push(...r.data)
    }
}

function onCancel() {
    emits('close')
}
async function onOk() {
    if (cameraName.value === '') {
        alert('카메라 이름을 설정하세요')
        return
    }
    if (mode.value === 'create') {
        const r = await postCamera({
            name: cameraName.value,
            video_port: +videoPort.value || 0,
            description: description.value,
            welder_id: selectedWelder.value,
        })
        if (r.code !== ResultCode.SUCCESS) {
            if (r.code === ResultCode.DUPLICATE_DATA) {
                alert('같은 이름의 작업실이 이미 존재합니다.')
            } else {
                alert('생성에 실패하였습니다.')
            }
        } else {
            alert(cameraName.value + '가 생성되었습니다.')
        }
    } else {
        const r = await patchCamera(currentCamera.value!.id, {
            name: cameraName.value,
            description: description.value,
            welder_id: selectedWelder.value,
            video_port: +videoPort.value || 0,
        })
        if (r.code !== ResultCode.SUCCESS) {
            if (r.code === ResultCode.DUPLICATE_DATA) {
                alert('같은 이름의 카메라가 이미 존재합니다.')
            } else {
                alert('수정에 실패하였습니다.')
            }
        } else {
            alert(cameraName.value + '가 수정되었습니다.')
        }
    }
    await useTaskItems().fetchCameras()
    emits('close')
}
function initEditMode() {
    if (mode.value === 'edit' && currentCamera.value) {
        cameraName.value = currentCamera.value.name
        description.value = currentCamera.value.description || ''
        if (currentCamera.value.welder_id) {
            selectedWelder.value = currentCamera.value.welder_id
        }
    }
}

fetchWelders()
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
