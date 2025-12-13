import { onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

export function useHiddenVideoManager() {
    const weldingStore = useWeldingStore()
    const { videoList, isPlaying, currentTime } = storeToRefs(weldingStore)
    let createdElements: HTMLVideoElement[] = []
    let currentMasterVideo: HTMLVideoElement | null = null

    function findLongestVideo(): HTMLVideoElement | null {
        if (createdElements.length === 0) {
            return null
        }

        // duration 이 유효한 것들 중 가장 긴 것 찾기
        return createdElements.reduce((prev, current) => {
            const prevDur = isNaN(prev.duration) ? 0 : prev.duration
            const currDur = isNaN(current.duration) ? 0 : current.duration
            return prevDur > currDur ? prev : current
        }, createdElements[0])
    }

    function createVideoElement(src: string): HTMLVideoElement {
        const video = document.createElement('video')
        video.crossOrigin = 'anonymous'
        video.playsInline = true
        video.muted = true
        video.preload = 'auto'

        video.style.position = 'fixed'
        video.style.top = '-9999px'
        video.style.left = '-9999px'
        video.style.width = '1px'
        video.style.height = '1px'
        video.style.visibility = 'hidden'

        if (src) {
            video.src = src
        }

        video.addEventListener('loadedmetadata', () => {
            if (!isNaN(video.duration)) {
                weldingStore.updateDuration(video.duration)
            }
        })

        video.addEventListener('loadeddata', () => {
            if (video.currentTime === 0) {
                video.currentTime = 0
            }
        })

        video.addEventListener('ended', () => {
            if (currentMasterVideo === video) {
                weldingStore.stop()
            }
        })

        document.body.appendChild(video)
        return video
    }

    function clearVideos() {
        createdElements.forEach((video, index) => {
            video.pause()
            video.removeAttribute('src')
            video.load()
            if (document.body.contains(video)) {
                document.body.removeChild(video)
            }
            weldingStore.setVideoElement(index, null)
        })
        createdElements = []
        currentMasterVideo = null
    }
    function onFrame(now: number, metadata: VideoFrameCallbackMetadata) {
        if (!currentMasterVideo || currentMasterVideo.paused) {
            return
        }

        // Store 시간 업데이트
        weldingStore.syncTime(currentMasterVideo.currentTime)

        // 재귀 호출
        currentMasterVideo.requestVideoFrameCallback(onFrame)
    }

    watch(
        videoList,
        (newList) => {
            clearVideos()
            if (!newList || newList.length === 0) {
                return
            }

            // 리스트가 바뀌면 Duration 초기화
            weldingStore.duration = 0

            const newElements: HTMLVideoElement[] = []
            newList.forEach((item, index) => {
                const el = createVideoElement(item.src)
                newElements.push(el)
                weldingStore.setVideoElement(index, el)
            })
            createdElements = newElements
        },
        { immediate: true, deep: true }
    )

    watch(isPlaying, (playing) => {
        if (playing) {
            // 재생 시작 시점에 가장 긴 비디오를 Master로 선정
            const master = findLongestVideo()
            if (master) {
                currentMasterVideo = master
                master.requestVideoFrameCallback(onFrame)
            }

            // 모든 비디오 재생
            createdElements.forEach((video) => {
                video.play().catch(() => {})
            })
        } else {
            // 정지
            createdElements.forEach((video) => {
                video.pause()
            })
            currentMasterVideo = null
        }
    })

    watch(currentTime, (time) => {
        createdElements.forEach((video) => {
            if (Math.abs(video.currentTime - time) > 0.3) {
                video.currentTime = time
            }
        })
    })

    onUnmounted(() => {
        clearVideos()
    })
}
