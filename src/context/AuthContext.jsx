import { createContext, useContext, useState, useEffect } from 'react'

const AuthCtx = createContext(null)
const API = import.meta.env.VITE_API_URL ?? null

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('jurisai_token')
    const saved = localStorage.getItem('jurisai_user')
    if (token && saved) setUser(JSON.parse(saved))
    setLoading(false)
  }, [])

  async function login(email, password) {
    if (!API) {
      const u = { id:'1', name:'Dr. Rafael Costa', email, role:'advogado' }
      localStorage.setItem('jurisai_token', 'mock-token')
      localStorage.setItem('jurisai_user', JSON.stringify(u))
      setUser(u); return { ok:true }
    }
    const res  = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) })
    const data = await res.json()
    if (!res.ok) return { ok:false, error: data.error }
    localStorage.setItem('jurisai_token', data.token)
    localStorage.setItem('jurisai_user', JSON.stringify(data.user))
    setUser(data.user)
    return { ok:true }
  }

  function logout() {
    localStorage.removeItem('jurisai_token')
    localStorage.removeItem('jurisai_user')
    setUser(null)
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
