import { useEffect, useState } from 'react'
import { Smartphone, CheckCircle, AlertCircle, RefreshCw, Wifi } from 'lucide-react'
import { api } from '../lib/api'

const STATUS_CONFIG = {
  open:        { label: 'Conectado',        color: '#1D9E75', bg: '#E1F5EE', icon: CheckCircle },
  connecting:  { label: 'Conectando...',    color: '#C8A84B', bg: '#FAEEDA', icon: RefreshCw   },
  close:       { label: 'Desconectado',     color: '#E24B4A', bg: '#FCEBEB', icon: AlertCircle },
  unknown:     { label: 'Verificando...',   color: '#9ca3af', bg: '#f3f4f6', icon: Wifi        },
  error:       { label: 'Erro de conexão',  color: '#E24B4A', bg: '#FCEBEB', icon: AlertCircle },
}

export default function WhatsAppConnect() {
  const [status,   setStatus]   = useState('unknown')
  const [qrcode,   setQrcode]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [polling,  setPolling]  = useState(null)

  async function checkStatus() {
    try {
      const res = await api.whatsapp?.status()
      setStatus(res?.status ?? 'unknown')
      if (res?.status === 'open') {
        setQrcode(null)
        clearInterval(polling)
      }
    } catch { setStatus('error') }
  }

  async function loadQRCode() {
    setLoading(true)
    try {
      const res = await api.whatsapp?.qrcode()
      if (res?.qrcode) setQrcode(res.qrcode)
    } catch (e) {
      alert(e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 5000)
    setPolling(interval)
    return () => clearInterval(interval)
  }, [])

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown
  const Icon = cfg.icon
  const connected = status === 'open'

  return (
    <div className="p-5 max-w-lg">
      <div className="mb-5">
        <h1 className="text-[17px] font-semibold text-gray-900">Conexão WhatsApp</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gerencie a conexão do número do escritório</p>
      </div>

      {/* Status card */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: cfg.bg }}>
            <Icon size={20} style={{ color: cfg.color }} className={status === 'connecting' ? 'animate-spin' : ''} />
          </div>
          <div>
            <p className="font-medium text-gray-900">Status da instância</p>
            <p className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</p>
          </div>
          <button onClick={checkStatus}
            className="ml-auto btn-ghost text-xs">
            <RefreshCw size={13} /> Atualizar
          </button>
        </div>

        {connected ? (
          <div className="flex items-center gap-2.5 p-3 rounded-xl"
            style={{ background: '#E1F5EE', border: '0.5px solid rgba(29,158,117,0.3)' }}>
            <CheckCircle size={16} style={{ color: '#1D9E75' }} className="flex-shrink-0" />
            <p className="text-sm" style={{ color: '#085041' }}>
              <span className="font-medium">WhatsApp conectado e funcionando.</span> A IA está respondendo automaticamente.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3 rounded-xl"
            style={{ background: '#FCEBEB', border: '0.5px solid rgba(226,75,74,0.2)' }}>
            <AlertCircle size={16} style={{ color: '#A32D2D' }} className="flex-shrink-0" />
            <p className="text-sm" style={{ color: '#A32D2D' }}>
              <span className="font-medium">WhatsApp desconectado.</span> Escaneie o QR Code abaixo para conectar.
            </p>
          </div>
        )}
      </div>

      {/* QR Code */}
      {!connected && (
        <div className="card">
          <p className="font-medium text-gray-900 mb-1">Conectar WhatsApp</p>
          <p className="text-xs text-gray-400 mb-4">
            Abra o WhatsApp no celular do escritório → Menu (⋮) → Aparelhos conectados → Conectar um aparelho → Escaneie o QR Code abaixo
          </p>

          {qrcode ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={qrcode}
                alt="QR Code WhatsApp"
                className="w-56 h-56 rounded-xl border border-gray-200"
              />
              <p className="text-xs text-gray-400">O QR Code expira em 60 segundos. Se expirar, clique em gerar novamente.</p>
              <button onClick={loadQRCode} disabled={loading} className="btn-ghost text-xs">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Gerar novo QR Code
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                <Smartphone size={40} className="text-gray-300" />
              </div>
              <button onClick={loadQRCode} disabled={loading} className="btn-gold">
                {loading
                  ? <><RefreshCw size={14} className="animate-spin" /> Gerando...</>
                  : <><Smartphone size={14} /> Gerar QR Code</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Como funciona</p>
        {[
          ['1', 'Clique em "Gerar QR Code"'],
          ['2', 'Abra o WhatsApp no celular do escritório'],
          ['3', 'Vá em Menu (⋮) → Aparelhos conectados → Conectar um aparelho'],
          ['4', 'Aponte a câmera para o QR Code acima'],
          ['5', 'O status mudará para "Conectado" automaticamente'],
        ].map(([n, t]) => (
          <div key={n} className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#C8A84B] flex items-center justify-center text-[10px] font-bold text-[#081724] flex-shrink-0">{n}</span>
            <span className="text-sm text-gray-600">{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
