import { axiosGet, type QueryParams } from '@/api/Axios.ts'

export interface Job {
    id: number
    welder_id: number
    welder_name: string
    booth_id: number
    booth_name: string
    start_time: number
    end_time: number
    videos: JobVideo[]
}

interface JobVideo {
    camera_id: number
    camera_name: string
    file_path: string
}

export interface JobMeasurement {
    timestamp: number
    voltage: number
    current: number
    wire_feeding_speed: number
}

export interface JobResponse {
    id: number
    videos: JobVideo[]
    measurements: JobMeasurement[]
    booth_id: number
    booth_name: string
    welder_id: number
    welder_name: string
    start: number
    end: number
}

export async function getJobs(query: QueryParams = {}) {
    return axiosGet<Job[]>('/api/jobs', query)
}

export async function getJobById(id: number | string) {
    return axiosGet<JobResponse>(`/api/job/${id}`)
}
