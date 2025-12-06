import type { ApiBaseResponse } from '@/api/Types.ts'
import axios, { type AxiosRequestHeaders } from 'axios'

interface QueryParams {
    [key: string]: string | number | boolean | string[] | undefined | null
}

function paramSerializer(params: Record<string, any>) {
    return Object.keys(params)
        .map((key) => {
            const value = params[key]
            if (Array.isArray(value)) {
                return value
                    .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                    .join('&')
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
        })
        .join('&')
}

export async function axiosGet<T>(
    endpoint: string,
    params?: QueryParams,
    headers?: AxiosRequestHeaders
) {
    if (params) {
        Object.keys(params).forEach((key) => {
            const value = params![key]
            if (value === undefined || value === null || value === '') {
                delete params![key]
            }
        })
    }
    const response = await axios.get(endpoint, {
        params,
        headers,
        paramsSerializer: paramSerializer,
    })
    return response.data as ApiBaseResponse<T>
}

export async function axiosPost<T>(
    endpoint: string,
    body?: Record<string, any>,
    headers?: AxiosRequestHeaders
) {
    const response = await axios.post(endpoint, body, {
        headers,
    })

    return response.data as ApiBaseResponse<T>
}

export async function axiosPut<T>(
    endpoint: string,
    body?: Record<string, any>,
    headers?: AxiosRequestHeaders
) {
    const response = await axios.put(endpoint, body, {
        headers,
    })

    return response.data as ApiBaseResponse<T>
}
