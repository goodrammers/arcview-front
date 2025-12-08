<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6">
            <div class="bg-white rounded-lg border border-gray-200 px-6 py-2 mb-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">실시간 보기</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <select
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                            @change="onBoothSelected"
                        >
                            <option value="">작업실 선택</option>
                            <option v-for="b in boothSelectors" :key="b.id" :value="b.id">
                                {{ b.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <select
                            :disabled="cameraSelectors.length === 0"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8 disabled:bg-gray-100"
                            @change="onCameraSelected"
                        >
                            <option value="">카메라 선택</option>
                            <option
                                v-for="camera in cameraSelectors"
                                :key="camera.id"
                                :value="camera.id"
                            >
                                {{ camera.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div
                class="bg-white rounded-lg border border-gray-200 py-6 px-10"
                style="display: flex"
            >
                <div
                    class="relative bg-black rounded-lg overflow-hidden"
                    style="height: 660px; width: 1000px"
                >
                    <video
                        ref="videoEl"
                        muted
                        autoplay
                        :class="[videoConnected ? 'w-100 h-100' : 'w-0 h-0']"
                    ></video>
                    <div
                        v-if="!videoConnected"
                        class="absolute inset-0 flex items-center justify-center"
                    >
                        <div class="text-center text-gray-400">
                            <div
                                class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto"
                            >
                                <i class="ri-video-off-line text-2xl"></i>
                            </div>
                            <p class="text-lg font-medium mb-2">영상 없음</p>
                        </div>
                    </div>
                </div>
                <div style="width: 400px; margin-left: 20px; color: black; padding: 20px">
                    <div>current: {{ realtimeData[realtimeData.length - 1]?.current }}</div>
                    <div>voltage: {{ realtimeData[realtimeData.length - 1]?.voltage }}</div>
                    <div>
                        feeding speed:
                        {{ realtimeData[realtimeData.length - 1]?.wire_feeding_speed }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getRealtimeBooth, getServerAddress, type RealTimeBoothItem } from '@/api/Realtime.ts'
import { usePlayer } from '@/composables/Player.ts'
import { ResultCode } from '@/api/Types.ts'

interface RealtimeWelder {
    welder_id: number
    current: number
    timestamp: number
    voltage: number
    wire_feeding_speed: number
}

const videoEl = ref<HTMLVideoElement>()
const videoConnected = ref(false)
const booths = ref<RealTimeBoothItem[]>([])
const boothSelectors = computed(() => {
    return booths.value.map((value) => ({ id: value.id, name: value.name }))
})
const cameraSelectors = computed(() => {
    const selected = booths.value.find((value) => value.id === +selectedBooth.value)
    if (selected) {
        return selected.cameras.map((value) => ({ id: value.id, name: value.name }))
    }
    return []
})
const selectedBooth = ref('')
const selectedCamera = ref<{ id: number; name: string; welder_id: number } | undefined>(undefined)
const realtimeData = ref<RealtimeWelder[]>([])
const MAX_DATA_LENGTH = 30
const serverAddress = ref('')

const { changeCam, setVideoEl } = usePlayer(serverAddress)

const ws = new WebSocket(`${window.location.origin.replace('http', 'ws')}/realtime`)
ws.onmessage = (event) => {
    const data = JSON.parse(event.data) as RealtimeWelder
    if (selectedCamera.value) {
        if (selectedCamera.value.welder_id === data.welder_id) {
            realtimeData.value.push(data)
            if (realtimeData.value.length > MAX_DATA_LENGTH) {
                realtimeData.value.shift()
            }
        }
    }
}

function connect() {
    if (!selectedCamera.value) {
        return
    }
    videoConnected.value = true
    const video = videoEl.value
    changeCam(selectedCamera.value.id)
    setVideoEl(video!)
}

function onBoothSelected(e: Event) {
    selectedBooth.value = (e.target as HTMLSelectElement).value
}
function onCameraSelected(e: Event) {
    const cameraId = (e.target as HTMLSelectElement).value

    const booth = booths.value.find((value) => value.id === +selectedBooth.value)
    if (booth) {
        selectedCamera.value = booth.cameras.find((value) => value.id === +cameraId)
    }
}

async function fetchItems() {
    const r = await getRealtimeBooth()
    if (r.code === ResultCode.SUCCESS && r.data) {
        booths.value = r.data
    } else {
        booths.value = []
    }
}
async function fetchAddress() {
    const r = await getServerAddress()
    if (r.code === ResultCode.SUCCESS && r.data) {
        serverAddress.value = r.data.ip
    } else {
        serverAddress.value = ''
    }
}
fetchAddress()
fetchItems()

watch(selectedCamera, () => {
    if (selectedCamera.value) {
        connect()
    }
})
</script>

<style scoped lang="scss"></style>
