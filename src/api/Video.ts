import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

export interface Video {
    id?: number
    job_id: number
    camera_id: number
    file_path?: string
}

// 전체 목록 조회 (GET /api/videos)
export async function fetchVideos(): Promise<Video[]> {
    const res = await api.get<Video[]>('/videos')
    return res.data
}

// 단일 조회 (GET /api/videos/:id)
export async function fetchVideoById(id: number): Promise<Video> {
    const res = await api.get<Video>(`/videos/${id}`)
    return res.data
}

// 생성 (POST /api/videos)
export async function createVideo(video: Video): Promise<Video> {
    const res = await api.post<Video>('/videos', video)
    return res.data
}

// 수정 (PUT /api/videos)
export async function updateVideo(video: Video): Promise<void> {
    await api.put('/videos', video)
}

// 삭제 (DELETE /api/videos/:id)
export async function deleteVideo(id: number): Promise<void> {
    await api.delete(`/videos/${id}`)
}
