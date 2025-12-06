import axios from 'axios'
import type { ApiBaseResponse } from '@/api/Types.ts'
import { axiosGet, axiosPost, axiosPut } from '@/api/Axios.ts'

const api = axios.create({
    baseURL: '/api',
})
export function getVideoDir() {
    return axiosGet<{ directory: string }>('/api/config/video')
}

export interface SetVideoParam {
    directory: string
}
export function putVideoDir(param: SetVideoParam) {
    return axiosPut<undefined>('/api/config/video', param)
}
export async function getServicePort() {
    return axiosGet<{ port: number }>('/api/config/port')
}

export interface SetPortParam {
    port: number
}
export function putServicePort(param: SetPortParam) {
    return axiosPut<undefined>('/api/config/port', param)
}
