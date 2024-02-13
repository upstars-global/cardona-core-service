import { Ref, ref } from 'vue'
import moment from 'moment'

export function useClockUtc({ isUtc }: { isUtc?: boolean }): {
  time: Ref<string>
  stopTime: Function
  runTime: Function
} {
  const currentTime = ref('')

  function getCurrentTime(): void {
    const currentTimeMoment = isUtc ? moment().utc() : moment()
    currentTime.value = currentTimeMoment.format('HH:mm:ss')
  }

  const runTime = () => {
    updateClock()
  }
  const stopTime = () => {
    clearInterval(interval)
  }

  let interval: ReturnType<typeof setInterval>

  function updateClock(): void {
    getCurrentTime()
    interval = setInterval(() => {
      getCurrentTime()
    }, 1000)
  }

  return {
    time: currentTime,
    stopTime,
    runTime,
  }
}
