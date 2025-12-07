import { axiosDelete, axiosGet, axiosPost, axiosPut, type QueryParams } from '@/api/Axios.ts'

export interface Welder {
    id: number
    booth_id: number
    name: string
    description?: string
    ip_address: string
    updated_at?: string
    cameras: { id: number; name: string; video_port: number; description: string }[]
}

export interface WelderPostParam {
    booth_id: number
    name: string
    description: string
    ip_address: string
    camera_ids: number[]
}
export type WelderPutParam = WelderPostParam & { id: number }

export async function postWelder(param: WelderPostParam) {
    return axiosPost<undefined>('/api/welder', param)
}
export async function putWelder(param: WelderPutParam) {
    return axiosPut<undefined>('/api/welder', param)
}
export async function deleteWelder(param: { id: number }) {
    return axiosDelete<undefined>('/api/welder', param)
}
export async function getWelders(queryParam: QueryParams = {}) {
    return axiosGet<Welder[]>('/api/welders', queryParam)
}
