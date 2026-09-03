let analyser: AnalyserNode | null = null
let created = false

/**
 * Crea una sola vez el grafo Web Audio para el elemento de audio compartido
 * (source -> analyser -> destination). No debe llamarse si el stream no es
 * CORS-capable, porque silenciaría la salida del elemento.
 */
export function ensureAudioGraph(audio: HTMLAudioElement): AnalyserNode | null {
  if (created) return analyser
  created = true
  try {
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctx) return null

    const ctx = new Ctx()
    const source = ctx.createMediaElementSource(audio)
    const node = ctx.createAnalyser()
    node.fftSize = 512
    node.smoothingTimeConstant = 0.85

    const gain = ctx.createGain()
    source.connect(node)
    node.connect(gain)
    gain.connect(ctx.destination)

    const resume = () => {
      if (ctx.state === 'suspended') void ctx.resume()
    }
    audio.addEventListener('play', resume)
    window.addEventListener('pointerdown', resume, { once: true })

    analyser = node
  } catch {
    analyser = null
  }
  return analyser
}
