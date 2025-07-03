// requestAnimationFrame
export function useRAF(fn: (time: DOMHighResTimeStamp) => void) {
    let frameId = -1
    let isStop = false
    let _fn = fn
    function run() {
        isStop = false

        const runImp = (time: DOMHighResTimeStamp) => {
            _fn(time)
            if (isStop) {
                if (frameId >= 0) {
                    cancelAnimationFrame(frameId)
                    frameId = -1
                    return
                }
            }
            frameId = requestAnimationFrame(runImp)
        }

        frameId = requestAnimationFrame(runImp)
    }
    function stop() {
        isStop = true
    }
    return {
        run,
        stop,
    }
}
