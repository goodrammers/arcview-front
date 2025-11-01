import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

export interface Job {
    id: number
    welder_id: number
    start_time: number
    end_time: number
}

export async function fetchJobs(): Promise<Job[]> {
    const res = await api.get<Job[]>('/jobs')
    return res.data
}
