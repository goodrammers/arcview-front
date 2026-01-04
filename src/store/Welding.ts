import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { getJobById, type JobResponse } from '@/api/Jobs.ts'
import { ResultCode } from '@/api/Types.ts'

export const useWeldingStore = defineStore('welding', () => {
    const currentJob = ref<JobResponse | null>(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const playbackRate = ref(1.0)

    // 비디오 엘리먼트 (DOM 요소이므로 shallowRef)
    const videoElements = shallowRef<(HTMLVideoElement | null)[]>([])

    const voltages = computed(() => {
        if (!currentJob.value) return []
        const start = currentJob.value.start
        return currentJob.value.measurements.map((m) => ({
            timestamp: (m.timestamp - start) / 1000000,
            value: m.voltage,
        }))
    })

    const currents = computed(() => {
        if (!currentJob.value) return []
        const start = currentJob.value.start
        return currentJob.value.measurements.map((m) => ({
            timestamp: (m.timestamp - start) / 1000000,
            value: m.current,
        }))
    })

    const feedingSpeed = computed(() => {
        if (!currentJob.value) return []
        const start = currentJob.value.start
        return currentJob.value.measurements.map((m) => ({
            timestamp: (m.timestamp - start) / 1000000,
            value: m.wire_feeding_speed,
        }))
    })

    const resistances = computed(() => {
        if (!currentJob.value) return []
        const start = currentJob.value.start
        return currentJob.value.measurements.map((m) => ({
            timestamp: (m.timestamp - start) / 1000000,
            value: getResistance(m.voltage, m.current),
        }))
    })

    const videoList = computed(() => {
        if (!currentJob.value) return []
        return currentJob.value.videos.map((v, idx) => ({
            index: idx,
            src: v.file_path, // 여기에 이미 '/videos/...'가 들어있음
            fileName: v.file_path.replace('/videos/', ''),
            camera_name: v.camera_name,
            camera_id: v.camera_id,
            start_time: v.start_time,
        }))
    })

    const boothName = computed(() => (currentJob.value ? currentJob.value.booth_name : '-'))
    const welderName = computed(() => (currentJob.value ? currentJob.value.welder_name : '-'))
    const currentJobId = computed(() => (currentJob.value ? currentJob.value.id : '-'))

    function getResistance(voltage: number, current: number) {
        if (current === 0) return 0
        const result = (voltage / current) * 1000
        return result > 1000 ? 1000 : result
    }

    async function fetchJob(jobId: number | string) {
        const r = await getJobById(jobId)
        if (r.code === ResultCode.SUCCESS && r.data) {
            currentJob.value = r.data
            currentTime.value = 0
            isPlaying.value = false

            if (currentJob.value.measurements.length > 0) {
                const start = currentJob.value.start
                const end = currentJob.value.end
                duration.value = (end - start) / 1000000
            }
        } else {
            currentJob.value = null
        }
    }

    function togglePlay() {
        isPlaying.value = !isPlaying.value
    }
    function stop() {
        isPlaying.value = false
        seekTo(0)
    }

    function seekTo(time: number) {
        currentTime.value = Math.max(0, Math.min(time, duration.value))
    }

    function updateDuration(vidDuration: number) {
        if (vidDuration > duration.value) {
            duration.value = vidDuration
        }
    }

    function syncTime(time: number) {
        currentTime.value = time
        if (duration.value > 0 && time >= duration.value) {
            isPlaying.value = false
        }
    }

    function setVideoElement(index: number, el: HTMLVideoElement | null) {
        if (videoElements.value.length <= index) {
            for (let i = videoElements.value.length; i <= index; i++) {
                videoElements.value[i] = null
            }
        }
        const newArr = [...videoElements.value]
        newArr[index] = el
        videoElements.value = newArr
    }

    return {
        currentJob,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        videoElements,

        voltages,
        currents,
        resistances,
        feedingSpeed,
        videoList,
        boothName,
        welderName,
        currentJobId,

        fetchJob,
        togglePlay,
        stop,
        seekTo,
        updateDuration,
        syncTime,
        setVideoElement,
    }
})
