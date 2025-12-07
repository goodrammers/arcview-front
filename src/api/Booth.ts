import axios from 'axios'
import { axiosDelete, axiosGet, axiosPost, axiosPut } from '@/api/Axios.ts'

export interface BoothResponseItem {
    id: number
    name: string
    location: string
    created_at: string
    updated_at: string
    welders: {
        id: number
        name: string
        ip_address: string
    }[]
    cameras: {
        id: number
        welder_id: number
        name: string
    }[]
}

export interface PostBoothParam {
    name: string
    location: string
    camera_ids: number[]
    welder_id: number
}

const api = axios.create({
    baseURL: '/api',
})

// 전체 목록 조회 (GET /api/booths)
export async function getBooths() {
    return axiosGet<BoothResponseItem[]>('/api/booths')
    // const res = await api.get<BoothResponseItem[]>('/booths')
    // return res.data
}

// 단일 조회 (GET /api/booths/:id)
export async function fetchBoothById(id: number): Promise<BoothResponseItem> {
    const res = await api.get<BoothResponseItem>(`/booths/${id}`)
    return res.data
}

// 수정 (PUT /api/booths)
export async function updateBooth(data: BoothResponseItem): Promise<void> {
    await api.put('/booths', data)
}

export async function postBooth(param: PostBoothParam) {
    return axiosPost<undefined>('/api/booth', param)
}
export async function putBooth(param: PostBoothParam & { id: number }) {
    return axiosPut<undefined>('/api/booth', param)
}

export async function deleteBooth(id: number) {
    return axiosDelete<undefined>('/api/booth', { id })
}
