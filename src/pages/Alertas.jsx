import { useState, useEffect } from 'react'
import { AlertTriangle, FileText, CheckCircle, Trash2, Edit3, Info } from 'lucide-react'
import { api } from '../lib/api'
import { useApp } from '../context/AppContext'
import { AreaBadge, PageHeader, EmptyState } from '../components/ui'

const TYPE_CFG = {
  sensitive_data:{ icon:AlertTriangle, label:'Dado pessoal sensível',   headerBg:'#FCEBEB', headerColor:'#A32D2D', reasonBg:'rgba(226,75,74,0.07)', reasonBorder:'rgba(226,75,74,0.2)', reasonColor:'#A32D2D' },
  document:      { icon:FileText,      label:'Solicitação de documento', headerBg:'#FAEEDA', headerColor:'#854F0B', reasonBg:'rgba(200,168,75,0.08)', reasonBorder:'rgba(200,168,75,0.3)', reasonColor:'#854F0B' },
}

function AlertCard({ alert, onApprove, onDiscard }) {
  const cfg = TYPE_CFG[alert.type] ?? TYPE_CFG.sensitive_data
  const Icon = cfg.icon
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(alert.draft)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100" style={{background:cfg.headerBg}}>
        <div className="flex items-center gap-2">
          <Icon size={15} style={{color:cfg.headerColor}}/>
          <span className="font-medium text-sm" style={{color:cfg.headerColor}}>{cfg.label} — {alert.clientName}</span>
        </div>
        <div className="flex items-center gap-3">
          <AreaBadge area={alert.area}/>
          <span className="text-xs" style={{color:cfg.headerColor}}>{alert.time}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[11px] text-gray-400 mb-1.5">Motivo da pausa:</p>
        <div className="rounded-lg px-3 py-2 text-xs mb-4"
          style={{background:cfg.reasonBg, border:`0.5px solid ${cfg.reasonBorder}`, color:cfg.reasonColor}}>
          {alert.reason}
        </div>
        <p className="text-[11px] text-gray-400 mb-1.5">{editing?'Editando mensagem:':'Mensagem que será enviada:'}</p>
        {editing
          ? <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C8A84B] resize-none mb-4"/>
          : <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-800 leading-relaxed mb-4">{draft}</div>
        }
        <div className="flex gap-2">
          <button onClick={()=>onApprove(alert.id, draft)} className="btn-success text-xs"><CheckCircle size={13}/> Aprovar e enviar</button>
          <button onClick={()=>setEditing(!editing)} className="btn-ghost text-xs"><Edit3 size={13}/> {editing?'Cancelar':'Editar'}</button>
          <button onClick={()=>onDiscard(alert.id)} className="btn-ghost text-xs ml-auto" style={{color:'#A32D2D',borderColor:'rgba(163,45,45,0.2)'}}>
            <Trash2 size={13}/> Descartar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Alertas() {
  const { alerts, resolveAlert } = useApp() ?? {}
  const [local, setLocal] = useState([])
  useEffect(()=>{ if(alerts) setLocal(alerts) },[alerts])

  function handleApprove(id, draft) {
    api.alerts.approve(id, draft)
    setLocal(p=>p.filter(a=>a.id!==id)); resolveAlert?.(id)
    alert('Mensagem aprovada e enviada!')
  }
  function handleDiscard(id) {
    api.alerts.discard(id)
    setLocal(p=>p.filter(a=>a.id!==id)); resolveAlert?.(id)
  }

  return (
    <div className="p-5 max-w-3xl">
      <PageHeader title="Alertas de Revisão"
        subtitle="Mensagens que a IA pausou antes de enviar — dados sensíveis ou documentos"/>
      {local.length===0
        ? <EmptyState icon={CheckCircle} title="Nenhuma revisão pendente" desc="Todas as mensagens foram aprovadas ou descartadas."/>
        : local.map(a=><AlertCard key={a.id} alert={a} onApprove={handleApprove} onDiscard={handleDiscard}/>)
      }
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-gray-100 bg-gray-50 mt-4">
        <Info size={15} className="text-gray-400 flex-shrink-0 mt-0.5"/>
        <p className="text-xs text-gray-500 leading-relaxed">
          A IA envia <strong>todas as outras mensagens automaticamente</strong>. Somente dados sensíveis (CPF, RG, dados bancários) e solicitações de documentos chegam aqui.
        </p>
      </div>
    </div>
  )
}
