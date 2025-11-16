import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

export interface RealtimeBooth {
    id: number
    welder_id: number
    welder_name: string
    booth_id: number
    booth_name: string
    start_time: number
    end_time: number
}

export interface RealTimeBoothItem {
    id: number
    name: string
    cameras: { id: number; name: string }[]
}

export async function getRealtimeBooth(): Promise<RealTimeBoothItem[]> {
    const res = await api.get<RealTimeBoothItem[]>('/realtime-booth')
    return res.data
}
