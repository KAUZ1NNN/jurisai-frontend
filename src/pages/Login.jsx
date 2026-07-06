import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale, Loader2, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    result.ok ? navigate('/', {replace:true}) : setError(result.error ?? 'Erro ao fazer login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#081724'}}>
      <div className="w-full max-w-sm mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#C8A84B] flex items-center justify-center mb-4 shadow-xl">
            <Scale size={28} color="#081724" />
          </div>
          <h1 className="text-2xl font-semibold text-white">JurisAI</h1>
          <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.4)'}}>Painel do Advogado</p>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Entrar na conta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="seu@email.com" required
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#C8A84B] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Senha</label>
              <div className="relative">
                <input type={showPwd?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#C8A84B] transition-colors pr-10" />
                <button type="button" onClick={()=>setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
            {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-medium text-sm py-2.5 rounded-xl disabled:opacity-70"
              style={{background:'#C8A84B',color:'#081724'}}>
              {loading ? <><Loader2 size={15} className="animate-spin"/> Entrando...</> : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-6" style={{color:'rgba(255,255,255,0.2)'}}>JurisAI v1.0 · Acesso restrito</p>
      </div>
    </div>
  )
}
