export async function getAudioObjectURL(src: string, cacheName = 'audio-cache') {
  const request = new Request(src, { mode: 'cors' })
  const cache = await caches.open(cacheName)

  let response = await cache.match(request)

  if (!response) {
    response = await fetch(request)

    if (response.ok && (response.type === 'basic' || response.type === 'cors'))
      await cache.put(request, response.clone())
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)

  return {
    url,
    release: () => URL.revokeObjectURL(url),
  }
}
