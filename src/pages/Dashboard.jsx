import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Bot, AlertTriangle, Users, Plus, ArrowRight, Zap, BarChart2 } from 'lucide-react'
import { api } from '../lib/api'
import { KpiCard, AreaBadge, PageHeader } from '../components/ui'
import { useAuth } from '../context/AuthContext'

const STATUS_STYLE = {
  Respondido:         { bg:'#E1F5EE', color:'#085041' },
  Aguardando:         { bg:'#FAEEDA', color:'#854F0B' },
  'Em atendimento':   { bg:'#E6F1FB', color:'#0C447C' },
  'Revisão pendente': { bg:'#FCEBEB', color:'#A32D2D' },
  Encerrado:          { bg:'#f3f4f6', color:'#6b7280' },
}

function convStatus(c) {
  if (c.hasAlert)            return 'Revisão pendente'
  if (c.status==='encerrado') return 'Encerrado'
  if (c.status==='assumido')  return 'Em atendimento'
  return 'Respondido'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats]         = useState(null)
  const [convs, setConvs]         = useState([])

  useEffect(() => {
    api.stats.get().then(setStats)
    api.conversations.list().then(c => setConvs((c??[]).slice(0,5)))
  }, [])

  const firstName = user?.name?.split(' ')[1] ?? user?.name?.split(' ')[0] ?? 'Doutor'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="p-5 max-w-5xl">
      <PageHeader
        title={`${greeting}, ${firstName} 👋`}
        subtitle={new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        actions={<>
          {stats?.pendingAlerts > 0 && (
            <button onClick={()=>navigate('/alertas')}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border cursor-pointer"
              style={{background:'#FCEBEB',color:'#A32D2D',borderColor:'rgba(163,45,45,0.2)'}}>
              <AlertTriangle size={14}/> {stats.pendingAlerts} revisões pendentes
            </button>
          )}
          <button onClick={()=>navigate('/conversas')} className="btn-gold">
            <Plus size={14}/> Nova conversa
          </button>
        </>}
      />

      {/* Banner IA */}
      <div className="flex items-start gap-3 p-3 rounded-xl mb-5 border"
        style={{background:'rgba(200,168,75,0.07)',borderColor:'rgba(200,168,75,0.25)'}}>
        <Bot size={17} style={{color:'#C8A84B'}} className="mt-0.5 flex-shrink-0"/>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">IA respondendo automaticamente. </span>
          Apenas dados sensíveis (CPF, documentos) são pausados para sua revisão.
        </p>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          <KpiCard label="Conversas ativas"    value={stats.activeConversations} sub="Neste momento"        icon={MessageCircle} iconColor="#378ADD"/>
          <KpiCard label="Enviadas pela IA"    value={`${stats.aiRate}%`}        sub="Últimas 24 horas"    icon={Bot}           iconColor="#1D9E75"/>
          <KpiCard label="Revisões pendentes"  value={stats.pendingAlerts}       sub="Aguardam aprovação"  icon={AlertTriangle} iconColor="#E24B4A"/>
          <KpiCard label="Clientes cadastrados"value={stats.totalClients}        sub="Total ativo"         icon={Users}         iconColor="#7F77DD"/>
        </div>
      )}

      {/* Conversas recentes */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="font-medium text-gray-900">Conversas recentes</span>
          <button onClick={()=>navigate('/conversas')} className="text-blue-500 text-xs flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight size={12}/>
          </button>
        </div>
        <table className="w-full border-collapse text-sm" style={{tableLayout:'fixed'}}>
          <thead>
            <tr className="bg-gray-50">
              {['Cliente','Última mensagem','Área','Status','Hora'].map((h,i)=>(
                <th key={h} className="text-left px-4 py-2 text-[11px] text-gray-400 font-normal"
                  style={{width:['20%','36%','14%','18%','12%'][i]}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {convs.map(c => {
              const st = convStatus(c); const ss = STATUS_STYLE[st]
              return (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={()=>navigate('/conversas',{state:{id:c.id}})}>
                  <td className="px-4 py-2.5 font-medium text-gray-900 truncate">{c.clientName}</td>
                  <td className="px-4 py-2.5 text-gray-500 truncate">{c.lastMessage}</td>
                  <td className="px-4 py-2.5"><AreaBadge area={c.area}/></td>
                  <td className="px-4 py-2.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-lg font-medium" style={{background:ss.bg,color:ss.color}}>{st}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-400">{c.time}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[{icon:Bot,title:'Configurar a IA',desc:'Ajuste o bot por área jurídica',to:'/ia'},
          {icon:Zap,title:'Automações',desc:'Gerencie fluxos automáticos',to:'/automacoes'},
          {icon:BarChart2,title:'Relatórios',desc:'Acompanhe o desempenho',to:'/relatorios'}]
          .map(({icon:Icon,title,desc,to})=>(
          <div key={to} onClick={()=>navigate(to)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-gray-300 transition-colors">
            <Icon size={20} style={{color:'#C8A84B'}} className="mb-2"/>
            <p className="font-medium text-gray-900 mb-0.5">{title}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
