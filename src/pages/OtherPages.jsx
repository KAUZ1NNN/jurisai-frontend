import { useEffect, useState } from 'react'
import { Search, Plus, UserPlus, Bot, BookOpen, AlertTriangle, Clock, Check, IdCard, FileText, Coins, Gavel, MessageCircle, ClipboardList, Star, RefreshCw, FileWarning, Zap, BarChart2 } from 'lucide-react'
import { api } from '../lib/api'
import { KANBAN_STAGES, AUTOMATIONS as AUTO_MOCK, STATS } from '../lib/mock'
import { AreaBadge, PageHeader, KpiCard, Toggle, EmptyState } from '../components/ui'
import { getAreaStyle } from '../lib/utils'

// ─── CLIENTES ────────────────────────────────────────────────────────────────
function ClientCard({ client }) {
  const s = getAreaStyle(client.area)
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2.5 cursor-pointer hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
          style={{background:s.bg,color:s.color}}>{client.initials}</div>
        <span className="font-medium text-gray-900 text-xs truncate">{client.name}</span>
      </div>
      <div className="flex items-center justify-between">
        <AreaBadge area={client.area}/>
        <span className="text-[10px] text-gray-400">{client.date}</span>
      </div>
    </div>
  )
}

export function Clientes() {
  const [clients, setClients] = useState([])
  const [search, setSearch]   = useState('')
  useEffect(()=>{ api.clients.list().then(c=>setClients(c??[])) },[])
  const filtered = clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()))
  const STAGE_DOT = {lead:'#378ADD',consulta:'#C8A84B',proposta:'#7F77DD',fechado:'#1D9E75'}

  return (
    <div className="p-5">
      <PageHeader title="Clientes" actions={<>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <Search size={13} className="text-gray-400"/>
          <input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 w-32"/>
        </div>
        <button className="btn-gold" onClick={()=>alert('Formulário de novo cliente')}>
          <Plus size={14}/> Novo cliente
        </button>
      </>}/>
      <div className="grid grid-cols-4 gap-3">
        {KANBAN_STAGES.map(stage=>{
          const sc = filtered.filter(c=>c.stage===stage.id)
          return (
            <div key={stage.id} className="bg-gray-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{background:STAGE_DOT[stage.id]}}/>
                  <span className="text-xs font-medium text-gray-600">{stage.label}</span>
                </div>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500">{sc.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {sc.map(c=><ClientCard key={c.id} client={c}/>)}
                {sc.length===0&&<div className="text-center py-6"><UserPlus size={20} className="text-gray-300 mx-auto mb-1"/><p className="text-xs text-gray-400">Vazio</p></div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── IA CONFIG ───────────────────────────────────────────────────────────────
export function IAConfig() {
  const [tone, setTone] = useState(35)
  const [welcome, setWelcome] = useState('Olá! 👋 Bem-vindo ao escritório do Dr. Rafael Costa. Atuamos em Direito do Consumidor, Previdenciário e Bancário. Como posso ajudar você hoje?')
  const [editW, setEditW]   = useState(false)
  const [triggers, setTriggers] = useState({cpf:true,docs:true,values:true,lawsuits:false})
  const toneLabel = tone<25?'Muito formal':tone<50?'Formal':tone<75?'Equilibrado':'Amigável'

  return (
    <div className="p-5 max-w-xl">
      <PageHeader title="IA & Bot"/>
      <div className="flex items-start gap-2.5 p-3 rounded-xl mb-4 border"
        style={{background:'rgba(200,168,75,0.07)',borderColor:'rgba(200,168,75,0.25)'}}>
        <Bot size={16} style={{color:'#C8A84B'}} className="flex-shrink-0 mt-0.5"/>
        <p className="text-sm text-gray-600"><span className="font-medium text-gray-900">Modo: Envio automático ativo.</span> A IA responde e envia todas as mensagens. Exceções abaixo.</p>
      </div>

      {/* Áreas */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-3"><BookOpen size={15} style={{color:'#C8A84B'}}/><span className="font-medium">Áreas de atuação</span></div>
        {[['consumidor','Direito do Consumidor','Negativação, cobranças abusivas, danos morais'],
          ['previdenciario','Direito Previdenciário','INSS, aposentadoria, benefício por incapacidade'],
          ['bancario','Direito Bancário','Tarifas indevidas, juros abusivos, superendividamento']].map(([k,l,d])=>(
          <div key={k} className="flex items-start gap-2 p-2.5 rounded-lg border mb-2 last:mb-0"
            style={{borderColor:'rgba(200,168,75,0.4)',background:'rgba(200,168,75,0.05)'}}>
            <div className="w-4 h-4 rounded bg-[#C8A84B] flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={11} color="#081724"/></div>
            <div><p className="text-sm font-medium text-gray-900">{l}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
          </div>
        ))}
      </div>

      {/* Gatilhos */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-3"><AlertTriangle size={15} style={{color:'#C8A84B'}}/><span className="font-medium">Gatilhos de pausa para revisão</span></div>
        {[{k:'cpf',l:'CPF, RG, dados bancários ou senhas',I:IdCard},{k:'docs',l:'Solicitação de documentos jurídicos',I:FileText},{k:'values',l:'Valores em propostas de honorários',I:Coins},{k:'lawsuits',l:'Processos judiciais específicos',I:Gavel}].map(({k,l,I})=>(
          <div key={k} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2"><I size={14} className="text-gray-400"/><span className="text-sm text-gray-800">{l}</span></div>
            <Toggle on={triggers[k]} onChange={v=>setTriggers(p=>({...p,[k]:v}))}/>
          </div>
        ))}
      </div>

      {/* Tom */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-3"><span style={{color:'#C8A84B'}}>🎙</span><span className="font-medium">Tom de comunicação</span></div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Muito formal</span>
          <input type="range" min={0} max={100} value={tone} onChange={e=>setTone(+e.target.value)} className="flex-1 accent-[#C8A84B]"/>
          <span className="text-xs text-gray-400 whitespace-nowrap">Amigável</span>
        </div>
        <p className="text-xs" style={{color:'#C8A84B'}}>Atual: <span className="font-medium">{toneLabel}</span></p>
      </div>

      {/* Horário */}
      <div className="card mb-3">
        <div className="flex items-center gap-2 mb-3"><Clock size={15} style={{color:'#C8A84B'}}/><span className="font-medium">Horário de funcionamento</span></div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[['Início','08:00'],['Término','18:00']].map(([l,v])=>(
            <div key={l}><p className="text-xs text-gray-400 mb-1">{l}</p><div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-900">{v}</div></div>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Toggle on={false} onChange={()=>{}}/><span className="text-xs text-gray-500">IA ativa 24h (fins de semana incluídos)</span>
        </label>
      </div>

      {/* Boas-vindas */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3"><span>👋</span><span className="font-medium">Mensagem de boas-vindas</span></div>
        {editW
          ? <textarea rows={4} value={welcome} onChange={e=>setWelcome(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8A84B] resize-none mb-2"/>
          : <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 leading-relaxed mb-2">{welcome}</div>
        }
        <button onClick={()=>setEditW(!editW)} className="btn-ghost text-xs">{editW?'Confirmar':'Editar mensagem'}</button>
      </div>

      <button onClick={()=>alert('Configurações salvas!')} className="btn-gold w-full justify-center py-2.5">Salvar configurações</button>
    </div>
  )
}

// ─── AUTOMAÇÕES ──────────────────────────────────────────────────────────────
const ICON_MAP = {MessageCircle,ClipboardList,Clock,Star,RefreshCw,FileWarning,Zap}

export function Automacoes() {
  const [autos, setAutos] = useState([])
  useEffect(()=>{ api.automations.list().then(a=>setAutos(a??[])) },[])
  function toggle(id){ setAutos(p=>p.map(a=>a.id===id?{...a,on:!a.on}:a)); api.automations.toggle(id) }

  return (
    <div className="p-5 max-w-2xl">
      <PageHeader title="Automações" subtitle="Disparos automáticos por área — sem intervenção humana"
        actions={<button className="btn-gold" onClick={()=>alert('Nova automação')}><Zap size={14}/> Nova automação</button>}/>
      <div className="space-y-2.5">
        {autos.map(a=>{
          const Icon = ICON_MAP[a.icon]??Zap
          return (
            <div key={a.id} className="card flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background:a.on?'rgba(200,168,75,0.1)':'#f3f4f6'}}>
                <Icon size={17} style={{color:a.on?'#C8A84B':'#9ca3af'}}/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm mb-0.5">{a.title}</p>
                <p className="text-xs text-gray-400 mb-2">{a.desc}</p>
                <span className="text-[11px] px-2 py-0.5 rounded-lg"
                  style={{background:a.on?'#E1F5EE':'#f3f4f6',color:a.on?'#085041':'#9ca3af'}}>{a.stat}</span>
              </div>
              <Toggle on={a.on} onChange={()=>toggle(a.id)}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── RELATÓRIOS ──────────────────────────────────────────────────────────────
export function Relatorios() {
  const s   = STATS
  const max = Math.max(...s.weeklyConversations)
  const days= ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']

  return (
    <div className="p-5 max-w-3xl">
      <PageHeader title="Relatórios"
        actions={<div className="flex gap-1.5">{['7 dias','30 dias','3 meses'].map((p,i)=>(
          <button key={p} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border-0"
            style={{background:i===0?'#C8A84B':'#f3f4f6',color:i===0?'#081724':'#6b7280'}}>{p}</button>
        ))}</div>}/>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <KpiCard label="Conversas totais"  value="101"  sub="Últimos 7 dias"    icon={MessageCircle} iconColor="#378ADD"/>
        <KpiCard label="Enviadas pela IA"  value="93%"  sub="Sem intervenção"   icon={Bot}           iconColor="#1D9E75"/>
        <KpiCard label="Revisões geradas"  value="7%"   sub="Sensíveis / docs"  icon={AlertTriangle} iconColor="#E24B4A"/>
        <KpiCard label="Satisfação média"  value="4.9/5" sub="22 avaliações"    icon={Star}          iconColor="#C8A84B"/>
      </div>
      <div className="card mb-4">
        <p className="font-medium text-gray-900 mb-4">Conversas por dia</p>
        <div className="flex items-end gap-2" style={{height:100}}>
          {days.map((d,i)=>(
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[11px] text-gray-400">{s.weeklyConversations[i]}</span>
              <div className="w-full rounded-t" style={{height:Math.round(s.weeklyConversations[i]/max*72),background:i===3?'#C8A84B':'rgba(200,168,75,0.3)'}}/>
              <span className="text-[11px] text-gray-400">{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="font-medium text-gray-900 mb-3">Por área</p>
          {s.areaBreakdown.map(({area,pct,color})=>(
            <div key={area} className="mb-2.5">
              <div className="flex justify-between mb-1"><span className="text-xs text-gray-700">{area}</span><span className="text-xs text-gray-400">{pct}%</span></div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${pct}%`,background:color}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <p className="font-medium text-gray-900 mb-3">Funil de conversões</p>
          {s.funnel.map(({label,value,pct})=>(
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-xs text-gray-500">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-900">{value}</span>
                {pct&&<span className="text-[11px] text-green-600 font-medium">{pct}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
