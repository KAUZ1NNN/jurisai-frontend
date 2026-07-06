import { useEffect, useRef, useCallback } from 'react'

const WS_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/^http/, 'ws') + '/ws'
  : null

export function useJurisSocket(onEvent) {
  const wsRef      = useRef(null)
  const timerRef   = useRef(null)
  const onEventRef = useRef(onEvent)
  useEffect(() => { onEventRef.current = onEvent }, [onEvent])

  const connect = useCallback(() => {
    if (!WS_URL) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const token = localStorage.getItem('jurisai_token')
    const ws = new WebSocket(token ? `${WS_URL}?token=${token}` : WS_URL)
    wsRef.current = ws
    ws.onopen    = () => { console.log('[WS] conectado'); clearTimeout(timerRef.current) }
    ws.onmessage = (e) => { try { onEventRef.current?.(JSON.parse(e.data)) } catch {} }
    ws.onclose   = () => { timerRef.current = setTimeout(connect, 3000) }
    ws.onerror   = () => ws.close()
  }, [])

  useEffect(() => {
    connect()
    return () => { clearTimeout(timerRef.current); wsRef.current?.close() }
  }, [connect])
}
