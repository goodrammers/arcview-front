import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

export interface Job {
    id: number
    welder_id: number
    welder_name: string
    booth_id: number
    booth_name: string
    start_time: number
    end_time: number
}

interface JobVideo {
    camera_id: number
    file_path: string
}

interface JobMeasurement {
    timestamp: number
    voltage: number
    current: number
    wire_feeding_speed: number
}

export interface JobResponse {
    id: number
    videos: JobVideo[]
    measurements: JobMeasurement[]
}

export async function geJobs(): Promise<Job[]> {
    const res = await api.get<Job[]>('/jobs')
    return res.data
}

export async function getJobById(id: number | string) {
    const res = await api.get(`/job/${id}`)
    return res.data as JobResponse
}
