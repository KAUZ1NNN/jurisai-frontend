import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageCircle, AlertTriangle, Users, Bot, Zap, BarChart2, Settings, Scale, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to:'/',           icon:LayoutDashboard, label:'Painel Geral'       },
  { to:'/conversas',  icon:MessageCircle,   label:'Conversas',          badge:'convs'  },
  { to:'/alertas',    icon:AlertTriangle,   label:'Alertas de Revisão', badge:'alerts' },
  { to:'/clientes',   icon:Users,           label:'Clientes'            },
  { to:'/ia',         icon:Bot,             label:'IA & Bot'            },
  { to:'/automacoes', icon:Zap,             label:'Automações'          },
  { to:'/relatorios', icon:BarChart2,       label:'Relatórios'          },
  { to:'/config',     icon:Settings,        label:'Configurações'       },
]

export default function Sidebar() {
  const { alerts, conversations } = useApp() ?? {}
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const activeConvs = conversations?.filter(c => c.status === 'ia_ativa').length || 0
  const badges = { alerts: alerts?.length || 0, convs: activeConvs }

  const initials = user?.name?.split(' ').map(n=>n[0]).slice(0,2).join('') ?? 'DR'

  return (
    <aside className="w-52 min-w-[208px] flex flex-col h-full" style={{background:'#081724'}}>
      {/* Logo */}
      <div className="px-3.5 py-4 flex items-center gap-2.5" style={{borderBottom:'0.5px solid rgba(255,255,255,0.06)'}}>
        <span className="w-8 h-8 rounded-lg bg-[#C8A84B] flex items-center justify-center flex-shrink-0">
          <Scale size={17} color="#081724" />
        </span>
        <div>
          <p className="text-white text-sm font-medium leading-tight">JurisAI</p>
          <p className="text-[10px] mt-0.5" style={{color:'rgba(255,255,255,0.3)'}}>Painel do Advogado</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto space-y-0.5">
        {NAV.map(({to, icon:Icon, label, badge}) => {
          const count = badge ? badges[badge] : 0
          return (
            <NavLink key={to} to={to} end={to==='/'} className={({isActive}) =>
              `sidebar-item ${isActive ? 'active' : ''}`}>
              {({isActive}) => (<>
                <Icon size={17} className="flex-shrink-0"
                  style={{color: isActive ? '#C8A84B' : 'rgba(255,255,255,0.38)'}} />
                <span className="flex-1 text-[13px]"
                  style={{color: isActive ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 500 : 400}}>
                  {label}
                </span>
                {count > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    {count}
                  </span>
                )}
              </>)}
            </NavLink>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3.5 py-3" style={{borderTop:'0.5px solid rgba(255,255,255,0.06)'}}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#C8A84B] flex items-center justify-center text-[10px] font-semibold text-[#081724] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-medium truncate">{user?.name ?? 'Advogado'}</p>
            <p className="text-[10px]" style={{color:'rgba(255,255,255,0.3)'}}>Consumidor · Prev. · Bancário</p>
          </div>
          <button onClick={() => { logout(); navigate('/login') }}
            title="Sair"
            className="text-white/30 hover:text-white/70 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
