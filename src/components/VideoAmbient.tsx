import { useEffect, useRef } from 'react'
import './VideoAmbient.css'

/** Из public/ — отдаётся с поддержкой Range, без упаковки в бандл. */
const VIDEO_SRC = `${import.meta.env.BASE_URL}ambient.webm`

/** Размытие в координатах битмапа канваса (как у CSS blur для того же размера). */
const CANVAS_BLUR_FILTER = 'blur(300px)'
const CANVAS_SCALE_FILTER = 1.12

const VideoAmbient = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const videoEl = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!videoEl || !canvas || !ctx) return

    let rafId = 0

    const syncCanvasSize = () => {
      const w = videoEl.videoWidth
      const h = videoEl.videoHeight
      if (w > 0 && h > 0) {
        canvas.width = w
        canvas.height = h
      }
    }

    const step = () => {
      ctx.filter = CANVAS_BLUR_FILTER
      ctx.scale(CANVAS_SCALE_FILTER, CANVAS_SCALE_FILTER)
      ctx.drawImage(videoEl, 0, 0)
      ctx.scale(1 / CANVAS_SCALE_FILTER, 1 / CANVAS_SCALE_FILTER)
      ctx.filter = 'none'
      rafId = requestAnimationFrame(step)
    }

    const onLoadedMetadata = () => {
      syncCanvasSize()
    }

    const onPlay = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(step)
    }

    const onPause = () => {
      cancelAnimationFrame(rafId)
    }

    videoEl.addEventListener('loadedmetadata', onLoadedMetadata)
    videoEl.addEventListener('play', onPlay)
    videoEl.addEventListener('pause', onPause)

    // Уже в кэше: метаданные могут быть до срабатывания loadedmetadata
    if (videoEl.readyState >= 1) {
      syncCanvasSize()
    }

    return () => {
      cancelAnimationFrame(rafId)
      videoEl.removeEventListener('loadedmetadata', onLoadedMetadata)
      videoEl.removeEventListener('play', onPlay)
      videoEl.removeEventListener('pause', onPause)
    }
  }, [])
  
  return (
    <div className="video-ambient-container">
      <video
        ref={videoRef}
        controls
        src={VIDEO_SRC}
        className="video-ambient"
        preload="metadata"
      />
      <canvas ref={canvasRef} id="ambient-canvas" className="ambient-canvas" />
    </div>
  )
}

export { VideoAmbient }