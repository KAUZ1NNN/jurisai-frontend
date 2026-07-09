import { useState, useEffect, useRef } from 'react'
import { Save, Eye, EyeOff, Upload, X, Clock, Bot, Building2, Lock, Loader2, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { Toggle, PageHeader } from '../components/ui'

// ─── API DE SETTINGS ──────────────────────────────────────────────────────────
const settingsApi = {
  get:          ()       => api.stats.get().then ? fetch_settings() : fetch_settings(),
  patch:        (data)   => patch_settings(data),
  patchPassword:(data)   => patch_password(data),
  uploadLogo:   (data)   => upload_logo(data),
}

async function fetch_settings() {
  const token = localStorage.getItem('jurisai_token')
  const BASE  = import.meta.env.VITE_API_URL
  if (!BASE) return mock_settings()
  const res = await fetch(`${BASE}/settings`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error('Erro ao carregar configurações')
  return res.json()
}

async function patch_settings(data) {
  const token = localStorage.getItem('jurisai_token')
  const BASE  = import.meta.env.VITE_API_URL
  if (!BASE) return { ok: true }
  const res = await fetch(`${BASE}/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

async function patch_password(data) {
  const token = localStorage.getItem('jurisai_token')
  const BASE  = import.meta.env.VITE_API_URL
  if (!BASE) return { ok: true }
  const res = await fetch(`${BASE}/settings/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

async function upload_logo(data) {
  const token = localStorage.getItem('jurisai_token')
  const BASE  = import.meta.env.VITE_API_URL
  if (!BASE) return { ok: true, logo: data.base64 }
  const res = await fetch(`${BASE}/settings/logo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

function mock_settings() {
  return {
    office_name: 'Dr. Sergio Augusto — Advogado',
    office_phone: '',
    office_email: 'sergiojurir@gmail.com',
    office_area: 'Consumidor · Previdenciário · Bancário',
    office_logo: '',
    welcome_message: 'Olá! 👋 Bem-vindo ao escritório do Dr. Sergio Augusto. Atuamos em Direito do Consumidor, Previdenciário e Bancário. Como posso ajudar você hoje?',
    office_hours_start: '08:00',
    office_hours_end: '18:00',
    office_hours_24h: 'false',
  }
}

// ─── COMPONENTE DE FEEDBACK ───────────────────────────────────────────────────
function SaveFeedback({ state }) {
  if (state === 'saving') return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <Loader2 size={13} className="animate-spin"/> Salvando...
    </span>
  )
  if (state === 'saved') return (
    <span className="flex items-center gap-1.5 text-xs text-green-600">
      <CheckCircle size={13}/> Salvo!
    </span>
  )
  if (state === 'error') return (
    <span className="text-xs text-red-500">Erro ao salvar</span>
  )
  return null
}

// ─── SEÇÃO ───────────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children }) {
  return (
    <div className="card mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon size={16} style={{ color: '#C8A84B' }} />
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      {children}
    </div>
  )
}

// ─── CAMPO ───────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="mb-3 last:mb-0">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const input = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#C8A84B] transition-colors"

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Configuracoes() {
  const [settings, setSettings]   = useState(null)
  const [loading,  setLoading]    = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  // Senha
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showPwd,    setShowPwd]    = useState(false)
  const [pwdState,   setPwdState]   = useState('idle')
  const [pwdError,   setPwdError]   = useState('')

  // Logo
  const [logoPreview, setLogoPreview] = useState('')
  const [logoLoading, setLogoLoading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    fetch_settings()
      .then(s => { setSettings(s); setLogoPreview(s.office_logo || '') })
      .catch(() => setSettings(mock_settings()))
      .finally(() => setLoading(false))
  }, [])

  // ── Salvar configurações gerais ────────────────────────────────────────────
  async function handleSave() {
    setSaveState('saving')
    try {
      await patch_settings(settings)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2500)
    } catch {
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  // ── Alterar senha ──────────────────────────────────────────────────────────
  async function handlePasswordChange() {
    setPwdError('')
    if (newPwd !== confirmPwd) { setPwdError('As senhas não coincidem'); return }
    if (newPwd.length < 6)    { setPwdError('Mínimo 6 caracteres'); return }
    setPwdState('saving')
    try {
      const res = await patch_password({ current_password: currentPwd, new_password: newPwd })
      if (!res.ok) { setPwdError(res.error); setPwdState('idle'); return }
      setPwdState('saved')
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      setTimeout(() => setPwdState('idle'), 2500)
    } catch {
      setPwdError('Erro ao alterar senha')
      setPwdState('idle')
    }
  }

  // ── Upload de logo ─────────────────────────────────────────────────────────
  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500_000) { alert('Imagem muito grande. Máximo 500KB.'); return }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const dataUrl  = ev.target.result
      const base64   = dataUrl.split(',')[1]
      const mimeType = file.type

      setLogoPreview(dataUrl)
      setLogoLoading(true)

      try {
        const res = await upload_logo({ base64, mimeType })
        if (res.ok) {
          setSettings(s => ({ ...s, office_logo: res.logo || dataUrl }))
        }
      } catch {
        alert('Erro ao enviar logo. Tente novamente.')
      } finally {
        setLogoLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoPreview('')
    setSettings(s => ({ ...s, office_logo: '' }))
    patch_settings({ office_logo: '' })
    fileRef.current.value = ''
  }

  if (loading) return (
    <div className="p-5 flex items-center gap-2 text-gray-400">
      <Loader2 size={16} className="animate-spin"/> Carregando configurações...
    </div>
  )

  return (
    <div className="p-5 max-w-xl">
      <PageHeader title="Configurações"
        actions={<SaveFeedback state={saveState}/>}
      />

      {/* ── DADOS DO ESCRITÓRIO ──────────────────────────────────────────── */}
      <Section icon={Building2} title="Dados do escritório">
        {/* Logo */}
        <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50 relative">
            {logoPreview ? (
              <>
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover"/>
                {logoLoading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 size={14} className="animate-spin text-gray-400"/>
                  </div>
                )}
              </>
            ) : (
              <Building2 size={22} className="text-gray-300"/>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Logo do escritório</p>
            <div className="flex gap-2">
              <button onClick={() => fileRef.current.click()}
                className="btn-ghost text-xs flex items-center gap-1.5">
                <Upload size={13}/> {logoPreview ? 'Trocar' : 'Enviar logo'}
              </button>
              {logoPreview && (
                <button onClick={removeLogo} className="btn-ghost text-xs text-red-500 border-red-200">
                  <X size={13}/> Remover
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">JPG, PNG ou SVG · Máx. 500KB</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange}/>
          </div>
        </div>

        <Field label="Nome do escritório">
          <input className={input} value={settings.office_name}
            onChange={e => setSettings(s => ({...s, office_name: e.target.value}))}
            placeholder="Ex: Dr. Sergio Augusto — Advogado"/>
        </Field>

        <Field label="Área de atuação">
          <input className={input} value={settings.office_area}
            onChange={e => setSettings(s => ({...s, office_area: e.target.value}))}
            placeholder="Ex: Consumidor · Previdenciário · Bancário"/>
        </Field>

        <Field label="Número WhatsApp Business">
          <input className={input} value={settings.office_phone}
            onChange={e => setSettings(s => ({...s, office_phone: e.target.value}))}
            placeholder="Ex: (11) 9 9999-0001"/>
        </Field>

        <Field label="E-mail para notificações">
          <input className={input} type="email" value={settings.office_email}
            onChange={e => setSettings(s => ({...s, office_email: e.target.value}))}
            placeholder="Ex: contato@escritorio.com.br"/>
        </Field>
      </Section>

      {/* ── HORÁRIO DE FUNCIONAMENTO ─────────────────────────────────────── */}
      <Section icon={Clock} title="Horário de funcionamento da IA">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Início">
            <input className={input} type="time" value={settings.office_hours_start}
              onChange={e => setSettings(s => ({...s, office_hours_start: e.target.value}))}/>
          </Field>
          <Field label="Término">
            <input className={input} type="time" value={settings.office_hours_end}
              onChange={e => setSettings(s => ({...s, office_hours_end: e.target.value}))}/>
          </Field>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Toggle
            on={settings.office_hours_24h === 'true'}
            onChange={v => setSettings(s => ({...s, office_hours_24h: String(v)}))}
          />
          <span className="text-sm text-gray-600">IA ativa 24h (incluindo fins de semana)</span>
        </label>
      </Section>

      {/* ── MENSAGEM DE BOAS-VINDAS ──────────────────────────────────────── */}
      <Section icon={Bot} title="Mensagem de boas-vindas da IA">
        <p className="text-xs text-gray-400 mb-2">Enviada automaticamente quando o cliente entrar em contato pela primeira vez.</p>
        <textarea
          className={`${input} resize-none`}
          rows={4}
          value={settings.welcome_message}
          onChange={e => setSettings(s => ({...s, welcome_message: e.target.value}))}
          placeholder="Ex: Olá! Bem-vindo ao escritório..."
        />
        <p className="text-[10px] text-gray-400 mt-1">{settings.welcome_message?.length ?? 0} caracteres</p>
      </Section>

      {/* ── BOTÃO SALVAR ─────────────────────────────────────────────────── */}
      <button onClick={handleSave} disabled={saveState === 'saving'}
        className="btn-gold w-full justify-center py-2.5 mb-4 disabled:opacity-70">
        {saveState === 'saving'
          ? <><Loader2 size={14} className="animate-spin"/> Salvando...</>
          : <><Save size={14}/> Salvar configurações</>
        }
      </button>

      {/* ── ALTERAR SENHA ────────────────────────────────────────────────── */}
      <Section icon={Lock} title="Alterar senha de acesso">
        <Field label="Senha atual">
          <div className="relative">
            <input className={`${input} pr-9`} type={showPwd ? 'text' : 'password'}
              value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
              placeholder="••••••••"/>
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
          </div>
        </Field>
        <Field label="Nova senha">
          <input className={input} type={showPwd ? 'text' : 'password'}
            value={newPwd} onChange={e => setNewPwd(e.target.value)}
            placeholder="Mínimo 6 caracteres"/>
        </Field>
        <Field label="Confirmar nova senha">
          <input className={input} type={showPwd ? 'text' : 'password'}
            value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
            placeholder="Repita a nova senha"/>
        </Field>
        {pwdError && (
          <p className="text-xs text-red-500 mb-3">{pwdError}</p>
        )}
        <button onClick={handlePasswordChange} disabled={!currentPwd || !newPwd || !confirmPwd || pwdState === 'saving'}
          className="btn-gold w-full justify-center py-2 disabled:opacity-50">
          {pwdState === 'saving' ? <><Loader2 size={13} className="animate-spin"/> Alterando...</>
           : pwdState === 'saved' ? <><CheckCircle size={13}/> Senha alterada!</>
           : <><Lock size={13}/> Alterar senha</>}
        </button>
      </Section>
    </div>
  )
}
