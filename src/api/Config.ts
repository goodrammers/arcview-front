import { axiosGet, axiosPut } from '@/api/Axios.ts'

export interface SetVideoParam {
    directory: string
}
export interface SetPortParam {
    port: number
}

export function getVideoDir() {
    return axiosGet<{ directory: string }>('/api/config/video')
}
export function putVideoDir(param: SetVideoParam) {
    return axiosPut<undefined>('/api/config/video', param)
}

export async function getServicePort() {
    return axiosGet<{ port: number }>('/api/config/port')
}
export function putServicePort(param: SetPortParam) {
    return axiosPut<undefined>('/api/config/port', param)
}
