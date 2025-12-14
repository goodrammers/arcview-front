import { axiosDelete, axiosGet, axiosPatch, axiosPost, type QueryParams } from '@/api/Axios.ts'

export interface Camera {
    id: number
    welder_id?: number
    welder_name?: string
    name: string
    description?: string
    video_port: number
    created_at?: string
    updated_at?: string
}
export interface CreateCameraParams {
    name: string
    video_port?: number
    description?: string
    welder_id?: number
}

export interface UpdateCameraParams {
    name?: string
    video_port?: number
    description?: string
    welder_id?: number
}

export async function getCameras(queryParam: QueryParams = {}) {
    return axiosGet<Camera[]>('/api/cameras', queryParam)
}
export async function postCamera(param: CreateCameraParams) {
    return await axiosPost<undefined>('/api/camera', param)
}
export async function patchCamera(id: number, param: UpdateCameraParams) {
    return await axiosPatch<undefined>(`/api/cameras/${id}`, param)
}
export async function deleteCamera(id: number) {
    await axiosDelete<undefined>(`/api/cameras/${id}`)
}
