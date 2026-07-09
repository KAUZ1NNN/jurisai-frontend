import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Conversas from './pages/Conversas'
import Alertas from './pages/Alertas'
import Configuracoes from './pages/Configuracoes'
import { Clientes, IAConfig, Automacoes, Relatorios } from './pages/OtherPages'

function PrivateRoutes() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#081724'}}>
      <div className="w-8 h-8 border-2 border-[#C8A84B] border-t-transparent rounded-full animate-spin"/>
    </div>
  )
  if (!user) return <Navigate to="/login" replace/>
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/"           element={<Dashboard/>}/>
          <Route path="/conversas"  element={<Conversas/>}/>
          <Route path="/alertas"    element={<Alertas/>}/>
          <Route path="/clientes"   element={<Clientes/>}/>
          <Route path="/ia"         element={<IAConfig/>}/>
          <Route path="/automacoes" element={<Automacoes/>}/>
          <Route path="/relatorios" element={<Relatorios/>}/>
          <Route path="/config"     element={<Configuracoes/>}/>
          <Route path="*"           element={<Navigate to="/" replace/>}/>
        </Routes>
      </Layout>
    </AppProvider>
  )
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace/>
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path="/*"     element={<PrivateRoutes/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
