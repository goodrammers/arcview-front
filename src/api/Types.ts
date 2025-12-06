export interface ApiBaseResponse<T> {
    code: number
    data?: T
    page?: {
        page: number
        size: number
        total_count: number
        total_page: number
    }
}

export const ResultCode = {
    SUCCESS: 200,
}
