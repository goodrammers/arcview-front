import { computed, type Ref, ref } from 'vue'

export function usePlayer(serverAddress: Ref<string>) {
    const camId = ref('')
    const url = computed(() =>
        camId.value && serverAddress.value !== ''
            ? `http://${serverAddress.value}:1985/rtc/v1/whep/?app=live&stream=cam-${camId.value}`
            : ''
    )

    const isPlaying = ref(false)
    // @ts-ignore
    let player = null

    function play() {
        // @ts-ignore
        if (player) {
            player.play()
            isPlaying.value = true
        }
    }
    function stop() {
        // @ts-ignore
        if (player) {
            player.close()
            player = null
            isPlaying.value = false
        }
    }
    function changeCam(id: string | number) {
        stop()
        camId.value = id.toString()

        // @ts-ignore
        player = new window.RtcWhepAsyncPlayer(url.value)
        play()
    }
    function setVideoEl(videoEl: HTMLVideoElement) {
        // @ts-ignore
        if (player) {
            videoEl.srcObject = player.stream
        }
    }

    return {
        play,
        stop,
        changeCam,
        setVideoEl,
    }
}
