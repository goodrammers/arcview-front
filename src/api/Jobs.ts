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

export async function geJobs(): Promise<Job[]> {
    const res = await api.get<Job[]>('/jobs')
    return res.data
}
