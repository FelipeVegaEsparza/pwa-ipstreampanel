export function videoEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  )
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null
}
