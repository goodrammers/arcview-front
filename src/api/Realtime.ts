import { axiosGet } from '@/api/Axios.ts'

export interface RealTimeBoothItem {
    id: number
    name: string
    cameras: { id: number; name: string; welder_id: number }[]
}

export async function getRealtimeBooth() {
    return axiosGet<RealTimeBoothItem[]>('/api/realtime-booth')
}
