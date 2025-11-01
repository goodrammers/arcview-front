import axios from 'axios'

export interface Booth {
    id: number
    name: string
    location?: string
    created_at?: string
    updated_at?: string
}
const api = axios.create({
    baseURL: '/api',
})

// 전체 목록 조회 (GET /api/booths)
export async function fetchBooths(): Promise<Booth[]> {
    const res = await api.get<Booth[]>('/booths')
    return res.data
}

// 단일 조회 (GET /api/booths/:id)
export async function fetchBoothById(id: number): Promise<Booth> {
    const res = await api.get<Booth>(`/booths/${id}`)
    return res.data
}

// 생성 (POST /api/booths)
export async function createBooth(data: Booth): Promise<Booth> {
    const res = await api.post<Booth>('/booths', data)
    return res.data
}

// 수정 (PUT /api/booths)
export async function updateBooth(data: Booth): Promise<void> {
    await api.put('/booths', data)
}

// 삭제 (DELETE /api/booths/:id)
export async function deleteBooth(id: number): Promise<void> {
    await api.delete(`/booths/${id}`)
}
