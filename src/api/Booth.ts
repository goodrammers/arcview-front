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
        cameras: {
            id: number
            name: string
        }[]
    }[]
}

export interface PostBoothParam {
    name: string
    location: string
    welder_id: number
}

export async function getBooths() {
    return axiosGet<BoothResponseItem[]>('/api/booths')
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
