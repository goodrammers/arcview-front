import { onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeldingStore } from '@/store/Welding.ts'

export function useHiddenVideoManager() {
    const weldingStore = useWeldingStore()
    const { videoList, isPlaying, currentTime } = storeToRefs(weldingStore)
    let createdElements: HTMLVideoElement[] = []
    let currentMasterVideo: HTMLVideoElement | null = null

    function findBestMasterVideo(): HTMLVideoElement | null {
        if (createdElements.length === 0 || videoList.value.length === 0) {
            return null
        }
        let minStartTime = videoList.value[0].start_time
        let bestIdx = 0

        videoList.value.forEach((v, idx) => {
            if (v.start_time < minStartTime) {
                minStartTime = v.start_time
                bestIdx = idx
            }
        })
        return createdElements[bestIdx] || null
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
        weldingStore.syncTime(currentMasterVideo.currentTime)
        currentMasterVideo.requestVideoFrameCallback(onFrame)
    }

    function getOffsetSeconds(index: number): number {
        if (videoList.value.length === 0) return 0
        const minStartTime = Math.min(...videoList.value.map((v) => v.start_time))
        const myStart = videoList.value[index].start_time
        return (myStart - minStartTime) / 1000000
    }

    watch(
        videoList,
        (newList) => {
            clearVideos()
            if (!newList || newList.length === 0) {
                return
            }
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
            const master = findBestMasterVideo()
            if (master) {
                currentMasterVideo = master
                master.requestVideoFrameCallback(onFrame)
            }

            createdElements.forEach((video, index) => {
                const offset = getOffsetSeconds(index)
                if (offset <= 0) {
                    video.play().catch(() => {})
                } else {
                    const globalTime = currentTime.value
                    if (globalTime >= offset) {
                        video.play().catch(() => {})
                    } else {
                        const delayMs = (offset - globalTime) * 1000
                        setTimeout(() => {
                            if (isPlaying.value) {
                                video.play().catch(() => {})
                            }
                        }, delayMs)
                    }
                }
            })
        } else {
            createdElements.forEach((video) => {
                video.pause()
            })
            currentMasterVideo = null
        }
    })

    watch(currentTime, (time) => {
        createdElements.forEach((video, index) => {
            const offset = getOffsetSeconds(index)
            const targetLocalTime = time - offset

            if (targetLocalTime < 0) {
                video.currentTime = 0
            } else {
                if (Math.abs(video.currentTime - targetLocalTime) > 0.3) {
                    video.currentTime = targetLocalTime
                }
            }
        })
    })

    onUnmounted(() => {
        clearVideos()
    })
}
