<template>
    <div class="flex-1 overflow-auto">
        <div class="p-6">
            <div class="bg-white rounded-lg border border-gray-200 px-6 py-2 mb-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">실시간 보기</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <select
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8"
                        >
                            <option value="">작업실을 선택</option>
                            <option value="1">1호 작업실</option>
                            <option value="2">2호 작업실</option>
                            <option value="3">3호 작업실</option>
                        </select>
                    </div>
                    <div>
                        <select
                            disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-8 disabled:bg-gray-100"
                        >
                            <option value="">카메라 선택</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg border border-gray-200 py-6 px-10">
                <div class="relative bg-black rounded-lg overflow-hidden" style="height: 660px">
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const videoEl = ref<HTMLVideoElement>()
const videoConnected = ref(false)

function connect(url: string) {
    videoConnected.value = true
    const video = videoEl.value
    // @ts-ignore
    let player = new window.RtcWhepAsyncPlayer(url)
    if (video) {
        video.srcObject = player.stream
    }
    player.play()
}

onMounted(() => {
    connect('http://192.168.0.64:1985/rtc/v1/whep/?app=live&stream=Cam-01')
})
</script>

<style scoped lang="scss"></style>
