import axios from 'axios'
import { axiosGet, type QueryParams } from '@/api/Axios.ts'

const api = axios.create({
    baseURL: '/api',
})

export interface Welder {
    id: number
    booth_id: number
    name: string
    description?: string
    ip_address: string
    created_at?: string
    updated_at?: string
}

// 전체 목록 조회 (GET /api/welders)
// export async function fetchWelders(): Promise<Welder[]> {
//     const res = await api.get<Welder[]>('/welders')
//     return res.data
// }
//
// // 단일 조회 (GET /api/welders/:id)
// export async function fetchWelderById(id: number): Promise<Welder> {
//     const res = await api.get<Welder>(`/welders/${id}`)
//     return res.data
// }
//
// // 생성 (POST /api/welders)
// export async function createWelder(data: Welder): Promise<Welder> {
//     const res = await api.post<Welder>('/welders', data)
//     return res.data
// }
//
// // 수정 (PUT /api/welders)
// export async function updateWelder(data: Welder): Promise<void> {
//     await api.put('/welders', data)
// }
//
// // 삭제 (DELETE /api/welders/:id)
// export async function deleteWelder(id: number): Promise<void> {
//     await api.delete(`/welders/${id}`)
// }
//
// export async function fetchWeldersByBooth(boothId: number): Promise<Welder[]> {
//     const res = await api.get<Welder[]>(`/welders/booth/${boothId}`)
//     return res.data
// }

export async function getWelders(queryParam: QueryParams) {
    return axiosGet<Welder[]>('/api/welders', queryParam)
}
