import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

export interface Camera {
    id: number
    welder_id: number
    name: string
    description?: string
    video_port: number
    created_at?: string
    updated_at?: string
}

// 전체 목록 조회 (GET /api/cameras)
export async function fetchCameras(): Promise<Camera[]> {
    const res = await api.get<Camera[]>('/cameras')
    return res.data
}

// 단일 조회 (GET /api/cameras/:id)
export async function fetchCameraById(id: number): Promise<Camera> {
    const res = await api.get<Camera>(`/cameras/${id}`)
    return res.data
}

// 생성 (POST /api/cameras)
export async function createCamera(data: Camera): Promise<Camera> {
    const res = await api.post<Camera>('/cameras', data)
    return res.data
}

// 수정 (PUT /api/cameras)
export async function updateCamera(data: Camera): Promise<void> {
    await api.put('/cameras', data)
}

// 삭제 (DELETE /api/cameras/:id)
export async function deleteCamera(id: number): Promise<void> {
    await api.delete(`/cameras/${id}`)
}

//  특정 용접사(welder_id) 기준으로 카메라 조회
export async function fetchCamerasByWelder(welderId: number): Promise<Camera[]> {
    const res = await api.get<Camera[]>(`/cameras/welder/${welderId}`)
    return res.data
}
