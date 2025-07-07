export async function fetchVideoMeta(src: string): Promise<{
    duration: number
    videoWidth: number
    videoHeight: number
}> {
    const video = document.createElement('video')
    video.preload = 'metadata'

    // 이벤트를 한번 대기하는 헬퍼
    const waitForEvent = (target: EventTarget, event: string) =>
        new Promise<Event>((resolve, reject) => {
            const onSuccess = (e: Event) => {
                cleanup()
                resolve(e)
            }
            const onError = () => {
                cleanup()
                reject(new Error('메타데이터 로드 실패'))
            }
            const cleanup = () => {
                target.removeEventListener(event, onSuccess)
                target.removeEventListener('error', onError)
            }

            target.addEventListener(event, onSuccess, { once: true })
            target.addEventListener('error', onError, { once: true })
        })

    video.src = src
    video.load()

    await waitForEvent(video, 'loadedmetadata')

    return {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
    }
}
