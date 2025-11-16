import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useVideoStore } from '@/store/Video.ts'
import { getJobById, type JobResponse } from '@/api/Jobs.ts'

export const useWeldingStore = defineStore('welding', () => {
    const currentJob = ref<JobResponse | null>(null)

    async function fetchJob(jobId: number | string) {
        currentJob.value = await getJobById(jobId)
        const { setVideo } = useVideoStore()
        if (currentJob.value.videos[0].file_path) {
            setVideo(0, currentJob.value.videos[0].file_path)
        }
        if (currentJob.value.videos[1].file_path) {
            setVideo(1, currentJob.value.videos[1].file_path)
        }
    }

    return {
        currentJob,

        fetchJob,
    }
})
