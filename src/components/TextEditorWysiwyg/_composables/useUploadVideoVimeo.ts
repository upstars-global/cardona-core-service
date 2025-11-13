import { type Ref, ref, watch } from 'vue'
import { VideoStatus } from '../../../stores/uploadVideo'
import { i18n } from '@/plugins/i18n'

type UploadFn = (file: File, editorKey: string) => Promise<string>
type GetStatusFn = (videoId: string) => Promise<VideoStatus>

export function useUploadVideoVimeo(
  {
    uploadFn,
    getStatusFn,
    pollMs = 5000,
  }: { uploadFn: UploadFn; getStatusFn: GetStatusFn; pollMs?: number },
) {
  const videoStatusById = ref<Record<string, VideoStatus>>({})
  let interval: null | ReturnType<typeof setInterval> = null

  const videoIframeHtml = (videoId: string) =>
    `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`

  const videoPlaceholderHtml = (videoId: string) =>
    `<div data-video-id="${videoId}" style="width:640px;height:360px;background-color:black;color:white;display:flex;justify-content:center;align-items:center;margin:0.1rem 0;"><div>${i18n.t('placeholder.videoIsCurrentlyProcessed')}</div></div>`

  function replaceOrInsertVideoBlock(html: string, videoId: string, status: VideoStatus): string {
    const iframeRe = new RegExp(`<iframe[^>]*src=["'][^"']*${videoId}[^"']*["'][^>]*>\\s*<\\/iframe>`, 'i')
    const placeholderRe = new RegExp(`<div[^>]*data-video-id=["']${videoId}["'][^>]*>.*?<\\/div>`, 'is')
    const block = status === VideoStatus.Available ? videoIframeHtml(videoId) : videoPlaceholderHtml(videoId)
    if (iframeRe.test(html))
      return html.replace(iframeRe, block)
    if (placeholderRe.test(html))
      return html.replace(placeholderRe, block)

    return html + block
  }

  function extractVideoIds(html: string): string[] {
    const iframeRe = /<iframe[^>]+src=["'](?:https?:)?\/\/(?:player\.)?vimeo\.com\/video\/(\d+)["'][^>]*><\/iframe>/gi
    const placeholderRe = /<div[^>]*data-video-id=["'](\d+)["'][^>]*>.*?<\/div>/gis
    const ids = new Set<string>()
    let m: RegExpExecArray | null
    while ((m = iframeRe.exec(html)) !== null) ids.add(m[1])
    while ((m = placeholderRe.exec(html)) !== null) ids.add(m[1])

    return Array.from(ids)
  }

  function makeVideosToCheck(content: string) {
    const ids = extractVideoIds(content)

    return ids
      .map(id => ({ id, status: videoStatusById.value[id] ?? VideoStatus.Uploading }))
      .filter(v => v.status !== VideoStatus.Available)
  }

  function startPolling(contentRef: Ref<string>) {
    if (interval)
      return
    interval = setInterval(async () => {
      const queue = makeVideosToCheck(contentRef.value)
      if (!queue.length)
        return

      const updates = await Promise.all(queue.map(async ({ id }) => {
        const status = await getStatusFn(id)

        return { id, status }
      }))

      updates.forEach(({ id, status }) => {
        videoStatusById.value[id] = status
        contentRef.value = replaceOrInsertVideoBlock(contentRef.value, id, status)
      })
    }, pollMs)
  }

  function stopPolling() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function watchContent(contentRef: Ref<string>) {
    watch(
      () => makeVideosToCheck(contentRef.value).map(v => `${v.id}:${v.status}`).join('|'),
      val => {
        if (!val)
          stopPolling()
        else startPolling(contentRef)
      },
      { immediate: true },
    )

    return stopPolling
  }

  async function handleBeforeUpload(files: File[], editorKey: string, contentRef: Ref<string>) {
    const file = files?.[0]
    if (!file)
      return false
    const videoId = await uploadFn(file, editorKey)

    videoStatusById.value[videoId] = VideoStatus.Uploading
    contentRef.value = replaceOrInsertVideoBlock(contentRef.value, videoId, VideoStatus.Uploading)

    return false
  }

  return {
    watchContent,
    handleBeforeUpload,
  }
}
