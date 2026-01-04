export function formatTime(durationSec: number): string {
    const totalSeconds = Math.ceil(durationSec)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => n.toString().padStart(2, '0')

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    } else {
        return `${pad(minutes)}:${pad(seconds)}`
    }
}

export function formatDuration(start: number, end: number) {
    const diff = (end - start) / 1000
    const totalSeconds = Math.floor(diff / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`
}

export function formatDate(dateStr: string | undefined | null) {
    if (!dateStr) {
        return '-'
    }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
        return dateStr
    }

    const YYYY = String(date.getFullYear())
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const DD = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}
