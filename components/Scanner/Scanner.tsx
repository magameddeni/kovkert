import { ZBarSymbol } from '@undecaf/zbar-wasm'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReturnArrow from '@/public/MobBackArrowIcon.svg'
import styles from './scanner.module.scss'

const useFps = () => {
  const [ms, setMs] = useState(0)
  const len = 10
  const [msArray] = useState(Array.from({ length: len }, () => 0))
  const reportMs = (report: number) => {
    msArray.shift()
    msArray.push(report)
    const sum = msArray.reduce((a, v) => a + v, 0)
    setMs(sum / len)
  }
  return {
    ms,
    reportMs
  }
}

type OnResultFn = (result: string) => unknown

const handleScanResult = (result: ZBarSymbol[], onResult: OnResultFn) => {
  const z = result.find((v) => ['ZBAR_EAN13', 'ZBAR_EAN8'].includes(v.typeName))
  if (z) {
    // @ts-ignore
    document.body.classList.remove('overFlow')
    // @ts-ignore
    document.querySelector('html').classList.remove('overFlow')
    return onResult(
      Array.from(z.data)
        .map((v: number) => String.fromCharCode(v))
        .join('')
    )
  }
}

const useWorker = (onScan: (data: ZBarSymbol[]) => any) => {
  const worker = useRef<Worker | null>(null)
  const [workerReady, setWorkerReady] = useState(false)
  const [workerError, setWorkerError] = useState('')

  useEffect(() => {
    const w = new Worker(new URL('./scanner.worker.ts', import.meta.url))
    worker.current = w
    w.addEventListener('message', (event: any) => {
      if (event.data.type === 'ready') {
        setWorkerReady(true)
      } else if (event.data.type === 'scan') {
        onScan(event.data.result)
      }
    })
    w.addEventListener('error', (event: any) => {
      setWorkerError(event.message)
    })
    return () => {
      worker.current?.terminate()
    }
  }, [onScan])

  return {
    worker,
    workerReady,
    workerError
  }
}

export const Scanner: React.FC<{ onResult: OnResultFn; show: any }> = ({ onResult, show }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoStream = useRef<MediaStream | null>(null)
  const pendingScans = useRef(0)
  const dateStart = useRef(0)

  const [videoReady, setVideoReady] = useState(false)

  const [dimensions, setDimensions] = useState<[number, number]>([0, 0])

  const [status, setStatus] = useState('Загрузка...')

  const { ms, reportMs } = useFps()

  const videoConstraints = {
    video: {
      width: {
        min: 1280
      },
      height: {
        min: 720
      },

      facingMode: 'environment'
    },
    audio: false
  }

  const onScanCallback = useCallback(
    (result: ZBarSymbol[]) => {
      pendingScans.current--
      handleScanResult(result, onResult)
      reportMs(Date.now() - dateStart.current)
    },
    [onResult, reportMs]
  )

  const { worker, workerReady, workerError } = useWorker(onScanCallback)

  useEffect(() => {
    if (!videoReady || !workerReady) return
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current

    const grab = () => {
      if (pendingScans.current < 1) {
        dateStart.current = Date.now()
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        worker.current?.postMessage({ type: 'scan', data })
        pendingScans.current++
      }
    }

    pendingScans.current = 0
    grab()
    const interval = setInterval(grab, 200)

    return () => {
      clearInterval(interval)
    }
  }, [worker, videoReady, workerReady])

  useEffect(() => {
    void (async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setStatus('Ваше устройство не поддерживает видео')
      }

      setStatus('Настройка камеры...')

      let cameraRes: MediaStream
      try {
        cameraRes = await navigator.mediaDevices.getUserMedia(videoConstraints)
      } catch (error: any) {
        console.error(error)
        if (error instanceof DOMException) {
          if (error.name === 'NotAllowedError') {
            return setStatus('Доступ к камере запрещен')
          }
        }
        setStatus('Не удалось получить доступ к камере')
        return
      }

      videoStream.current = cameraRes

      const video = videoRef.current
      if (!video) return

      setStatus('Настройка камеры...')

      video.srcObject = cameraRes
      video
        .play()
        .then(() => {
          setDimensions([video.videoWidth, video.videoHeight])
          const canvas = canvasRef.current
          if (canvas) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
          }

          setStatus('Running...')
          setVideoReady(true)
          document.body.classList.add('overFlow')
        })
        .catch((error) => {
          console.warn('unable to play video', error)
        })
    })()

    return () => {
      console.info('Clearing up...')
      videoStream.current?.getTracks().forEach((track) => track.stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!videoReady && (
        <div className={styles.status}>
          <p>{status}</p>
        </div>
      )}
      <div className={styles.scanner_container} style={{ display: videoReady ? undefined : 'none' }}>
        <div className={styles.scanner_top}>
          <div onClick={show}>
            <ReturnArrow />
          </div>
          <p>Сканер Штрихкода</p>
        </div>
        <div className={styles.scanner}>
          <video playsInline ref={videoRef} />
          <canvas ref={canvasRef} width='640' height='480' />
        </div>
        <div className={styles.scanner_frame_container}>
          <div className={styles.frame_style}>
            <div className={styles.frame} />
            <div className={styles.frame_mask} />
          </div>
          <div className={styles.frame_text}>
            Наведите камеру на штрихкод товара или упаковки.
            <div className='absolute'>
              <span className='bg-white'>
                {dimensions[0]}×{dimensions[1]} --
              </span>
              <span className='bg-white px-1 py-0.5'>
                {workerError
                  ? `Worker error: ${workerError}`
                  : workerReady
                    ? ` ${ms.toFixed(1)} ms`
                    : 'Worker not ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
