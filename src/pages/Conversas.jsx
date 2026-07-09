import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, MoreVertical, UserCheck, Bot, CheckCheck, AlertTriangle, Send } from 'lucide-react'
import { api } from '../lib/api'
import { AreaBadge } from '../components/ui'
import { getAreaStyle } from '../lib/utils'

function ConvItem({ c, active, onClick }) {
  const s = getAreaStyle(c.area)
  return (
    <div onClick={onClick}
      className={`flex gap-2.5 px-3 py-2.5 cursor-pointer border-b border-gray-100 hover:bg-gray-50 relative ${active?'bg-gray-50':''}`}>
      {c.hasAlert && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"/>}
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
        style={{background:active?'#C8A84B':'#f3f4f6', color:active?'#081724':'#6b7280'}}>
        {c.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <span className="font-medium text-gray-900 text-[13px]">{c.clientName}</span>
          <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{c.time}</span>
        </div>
        <p className="text-xs text-gray-500 truncate mb-1">{c.lastMessage}</p>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{background:s.bg,color:s.color}}>{s.label}</span>
      </div>
    </div>
  )
}

function Bubble({ msg }) {
  const out = msg.dir === 'out'
  const pending = msg.status === 'pending_review'
  return (
    <div className={`flex flex-col gap-1 max-w-[78%] ${out?'self-end items-end':'self-start items-start'}`}>
      {out && (
        <span className={`text-[10px] font-medium flex items-center gap-1 ${pending?'text-red-500':'text-gray-400'}`}>
          {pending ? <><AlertTriangle size={10}/> Aguardando revisão</> : <><CheckCheck size={10} style={{color:'#C8A84B'}}/> Enviado pela IA</>}
        </span>
      )}
      <div className="px-3 py-2 text-[13px] leading-relaxed" style={{
        background: out?(pending?'rgba(226,75,74,0.07)':'rgba(200,168,75,0.09)'):'#fff',
        border: `0.5px solid ${out?(pending?'rgba(226,75,74,0.3)':'rgba(200,168,75,0.3)'):'#e5e7eb'}`,
        borderRadius: out?'10px 3px 10px 10px':'3px 10px 10px 10px', color:'#111827',
      }}>{msg.text}</div>
      <span className="text-[10px] text-gray-400 px-0.5">{msg.time}</span>
    </div>
  )
}

export default function Conversas() {
  const location = useLocation()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [filter, setFilter]     = useState('Todas')
  const [draft, setDraft]       = useState('')

  useEffect(() => {
    api.conversations.list().then(list => {
      const l = list ?? []
      setConversations(l)
      setActiveId(location.state?.id ?? l[0]?.id)
    })
  }, [])

  const areaKey = {Consumidor:'consumidor','Previdenciário':'previdenciario','Bancário':'bancario'}
  const filtered = conversations.filter(c => filter==='Todas' || c.area===areaKey[filter])
  const active   = conversations.find(c => c.id === activeId)
  const aStyle   = active ? getAreaStyle(active.area) : null
  const hasAlert = active?.messages?.some(m => m.status==='pending_review')

  async function handleSend() {
    if (!draft.trim() || !active) return
    await api.conversations.sendMsg(active.id, draft)
    setDraft('')
  }

  return (
    <div className="flex h-full">
      {/* Lista */}
      <div className="w-[38%] min-w-0 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-2.5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 mb-2">
            <Search size={13} className="text-gray-400"/>
            <input placeholder="Buscar..." className="bg-transparent text-sm text-gray-600 flex-1 outline-none placeholder-gray-400"/>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['Todas','Consumidor','Previdenciário','Bancário'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className="text-[11px] px-2 py-1 rounded-md cursor-pointer border-0"
                style={{background:filter===f?'#C8A84B':'#f3f4f6', color:filter===f?'#081724':'#6b7280'}}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(c=>(
            <ConvItem key={c.id} c={c} active={c.id===activeId} onClick={()=>setActiveId(c.id)}/>
          ))}
        </div>
      </div>

      {/* Chat */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-200 bg-white flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{background:aStyle?.bg, color:aStyle?.color}}>{active.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-[13px]">{active.clientName}</p>
              <p className="text-[11px] text-gray-400">{active.phone} · {aStyle?.label}</p>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 flex items-center gap-1"
              style={active.status==='ia_ativa'?{background:'#E1F5EE',color:'#085041'}:active.status==='assumido'?{background:'#E6F1FB',color:'#0C447C'}:{background:'#f3f4f6',color:'#6b7280'}}>
              {active.status==='ia_ativa'&&<Bot size={11}/>}
              {active.status==='ia_ativa'?'IA ativa':active.status==='assumido'?'Assumido':'Encerrado'}
            </span>
            {active.status!=='encerrado'&&(
              <button onClick={()=>api.conversations.status(active.id,'assumido')} className="btn-ghost text-xs">
                <UserCheck size={13}/> Assumir
              </button>
            )}
            <MoreVertical size={17} className="text-gray-400 cursor-pointer flex-shrink-0"/>
          </div>

          {hasAlert&&(
            <div className="mx-4 mt-3 flex items-start gap-2.5 p-2.5 rounded-lg border"
              style={{background:'#FCEBEB',borderColor:'rgba(163,45,45,0.2)'}}>
              <AlertTriangle size={14} style={{color:'#A32D2D'}} className="flex-shrink-0 mt-0.5"/>
              <p className="text-xs" style={{color:'#A32D2D'}}>
                <span className="font-medium">Mensagem aguardando revisão.</span> Verifique em <strong>Alertas de Revisão</strong>.
              </p>
            </div>
          )}

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5" style={{background:'#f9fafb'}}>
            {active.messages?.map(m=><Bubble key={m.id} msg={m}/>)}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
            {active.status==='ia_ativa'?(
              <div className="flex items-center gap-2.5 p-3 rounded-lg border"
                style={{background:'rgba(200,168,75,0.07)',borderColor:'rgba(200,168,75,0.2)'}}>
                <Bot size={15} style={{color:'#C8A84B'}} className="flex-shrink-0"/>
                <p className="text-sm text-gray-600 flex-1">
                  <span className="font-medium text-gray-900">IA respondendo automaticamente. </span>
                  Clique em <strong>Assumir</strong> para tomar controle.
                </p>
              </div>
            ):active.status==='assumido'?(
              <div className="flex gap-2">
                <input value={draft} onChange={e=>setDraft(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&handleSend()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8A84B]"/>
                <button onClick={handleSend} className="btn-gold px-4"><Send size={14}/></button>
              </div>
            ):(
              <p className="text-center text-sm text-gray-400">Conversa encerrada</p>
            )}
          </div>
        </div>
      ):(
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Selecione uma conversa</div>
      )}
    </div>
  )
}
