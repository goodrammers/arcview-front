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
const currentBooth = computed(() => booths.value.find((value) => value.id === boothId.value))

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
