import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const INTRO_SRC = '/media/ivo-tech-intro.mp4'
const INTRO_POSTER = '/media/ivo-tech-intro-poster.jpg'
const INTRO_START_TIMEOUT = 6000

/**
 * Loading screen. First visit of a session plays the brand intro video.
 * Sound policy: try playback with audio; if the browser blocks it (autoplay
 * policy), continue muted and offer a "Ton an" pill that restarts the intro
 * with sound from the beginning. Later visits in the same session skip
 * straight to the app via sessionStorage. Reduced motion skips the video;
 * automation (`navigator.webdriver`) uses the classic count-up loader so
 * tests stay fast and codec-independent.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'counting' | 'done'>('counting')
  const [mode, setMode] = useState<'deciding' | 'video' | 'count'>('deciding')
  const [audioState, setAudioState] = useState<'unknown' | 'muted' | 'on'>('unknown')
  const [videoProgress, setVideoProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const finishedRef = useRef(false)

  // Decide once: intro video or classic count-up.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || sessionStorage.getItem('ivo-loaded') === 'true') {
      onDone()
      return
    }
    setMode(navigator.webdriver ? 'count' : 'video')
  }, [onDone])

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    sessionStorage.setItem('ivo-loaded', 'true')
    setPhase('done')
    window.setTimeout(onDone, 80)
  }

  // Video mode: sound attempt, progress line, end/skip/error all finish.
  useEffect(() => {
    if (mode !== 'video') return
    const v = videoRef.current

    // Try with sound first — most browsers reject this without a prior
    // user gesture, then we fall back to muted and offer the sound pill.
    if (v) {
      v.muted = false
      v.play()
        .then(() => setAudioState('on'))
        .catch(() => {
          v.muted = true
          v.play().catch(() => {})
          setAudioState('muted')
        })
    }

    const watchdog = window.setTimeout(() => {
      const vid = videoRef.current
      if (!vid || (vid.currentTime === 0 && vid.readyState < 3)) finish()
    }, INTRO_START_TIMEOUT)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish()
    }
    const onTime = () => {
      const vid = videoRef.current
      if (vid && vid.duration) setVideoProgress((vid.currentTime / vid.duration) * 100)
    }
    window.addEventListener('keydown', onKey)
    v?.addEventListener('timeupdate', onTime)
    return () => {
      window.clearTimeout(watchdog)
      window.removeEventListener('keydown', onKey)
      v?.removeEventListener('timeupdate', onTime)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Count mode: the classic 500ms count-up (test path / no-video fallback).
  useEffect(() => {
    if (mode !== 'count') return
    const started = performance.now()
    const timer = window.setInterval(() => {
      const next = Math.min(100, Math.round(((performance.now() - started) / 500) * 100))
      setProgress(next)
      if (next >= 100) {
        window.clearInterval(timer)
        window.setTimeout(finish, 80)
      }
    }, 24)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Restart from 0 with sound — a click is the user gesture browsers require.
  const enableSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.volume = 1
    v.currentTime = 0
    v.play().catch(() => {
      // Unmuted playback refused: keep the show running muted instead of freezing.
      v.muted = true
      v.play().catch(() => {})
      setAudioState('muted')
    })
    setAudioState('on')
  }

  return (
    <AnimatePresence>
      {phase !== 'done' ? (
        <motion.div
          className="loader"
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {mode === 'video' ? (
            <div className="loader-video-wrap">
              <video
                ref={videoRef}
                className="loader-video"
                src={INTRO_SRC}
                poster={INTRO_POSTER}
                autoPlay
                playsInline
                preload="auto"
                aria-label="ivo-tech Intro"
                onEnded={finish}
                onError={finish}
              />
              <div className="loader-progress" aria-hidden="true">
                <div className="loader-progress-fill" style={{ width: `${videoProgress}%` }} />
              </div>
              <div className="loader-controls">
                {audioState === 'muted' ? (
                  <button type="button" className="loader-pill loader-sound" onClick={enableSound}>
                    <span className="loader-sound-icon" aria-hidden="true">♪</span> Ton an
                  </button>
                ) : null}
                <button type="button" className="loader-pill loader-skip" onClick={finish}>
                  Intro überspringen
                </button>
              </div>
            </div>
          ) : (
            <div className="loader-inner">
              <motion.div
                className="loader-wordmark"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src="/brand/logos/ivo-tech-logo-master.svg" alt="ivo-tech" decoding="async" width={140} height={31} />
              </motion.div>
              <div className="loader-bar">
                <motion.div className="loader-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="loader-num">{String(progress).padStart(3, '0')}</div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
