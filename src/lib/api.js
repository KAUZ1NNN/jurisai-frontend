import { CONVERSATIONS, ALERTS, CLIENTS, AUTOMATIONS, STATS } from './mock'

const delay = (ms=300) => new Promise(r=>setTimeout(r,ms))
const BASE_URL = import.meta.env.VITE_API_URL || null

function getHeaders() {
  const token = localStorage.getItem('jurisai_token')
  return { 'Content-Type':'application/json', ...(token ? { Authorization:`Bearer ${token}` } : {}) }
}

async function request(path, opts={}) {
  if (!BASE_URL) {
    await delay()
    return mockHandlers[path]?.(opts) ?? null
  }
  const res = await fetch(`${BASE_URL}${path}`, { headers: getHeaders(), ...opts })
  if (res.status === 401) {
    localStorage.removeItem('jurisai_token')
    localStorage.removeItem('jurisai_user')
    window.location.href = '/login'
    return null
  }
  if (!res.ok) { const e = await res.json().catch(()=>({})); throw new Error(e.error ?? `API ${res.status}`) }
  return res.json()
}

const mockHandlers = {
  '/conversations': ()=>CONVERSATIONS,
  '/alerts':        ()=>ALERTS,
  '/clients':       ()=>CLIENTS,
  '/automations':   ()=>AUTOMATIONS,
  '/stats':         ()=>STATS,
}

export const api = {
  conversations: {
    list:    ()          => request('/conversations'),
    get:     (id)        => request(`/conversations/${id}`),
    status:  (id,status) => request(`/conversations/${id}/status`,   { method:'PATCH', body:JSON.stringify({status}) }),
    sendMsg: (id,text)   => request(`/conversations/${id}/messages`, { method:'POST',  body:JSON.stringify({text})   }),
  },
  alerts: {
    list:    ()          => request('/alerts'),
    approve: (id,draft)  => request(`/alerts/${id}/approve`, { method:'POST', body:JSON.stringify({draft}) }),
    discard: (id)        => request(`/alerts/${id}/discard`, { method:'POST' }),
  },
  clients: {
    list:        ()           => request('/clients'),
    updateStage: (id,stage)   => request(`/clients/${id}/stage`, { method:'PATCH', body:JSON.stringify({stage}) }),
  },
  automations: {
    list:   ()       => request('/automations'),
    toggle: (id,on)  => request(`/automations/${id}`, { method:'PATCH', body:JSON.stringify({on}) }),
  },
  stats: { get: () => request('/stats') },
}
