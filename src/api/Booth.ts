import axios from 'axios'

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
const api = axios.create({
    baseURL: '/api',
})

// 전체 목록 조회 (GET /api/booths)
export async function fetchBooths(): Promise<BoothResponseItem[]> {
    const res = await api.get<BoothResponseItem[]>('/booths')
    return res.data
}

// 단일 조회 (GET /api/booths/:id)
export async function fetchBoothById(id: number): Promise<BoothResponseItem> {
    const res = await api.get<BoothResponseItem>(`/booths/${id}`)
    return res.data
}

// 생성 (POST /api/booths)
export async function createBooth(data: BoothResponseItem): Promise<BoothResponseItem> {
    const res = await api.post<BoothResponseItem>('/booths', data)
    return res.data
}

// 수정 (PUT /api/booths)
export async function updateBooth(data: BoothResponseItem): Promise<void> {
    await api.put('/booths', data)
}

// 삭제 (DELETE /api/booths/:id)
export async function deleteBooth(id: number): Promise<void> {
    await api.delete(`/booths/${id}`)
}
