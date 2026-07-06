import { getAreaStyle } from '../../lib/utils'

export function KpiCard({ label, value, sub, icon:Icon, iconColor }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 leading-snug">{label}</span>
        <Icon size={18} style={{color:iconColor}} className="flex-shrink-0" />
      </div>
      <p className="text-2xl font-semibold text-gray-900 leading-none mb-1">{value}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  )
}

export function AreaBadge({ area }) {
  const s = getAreaStyle(area)
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium"
      style={{ background:s.bg, color:s.color }}>
      {s.label}
    </span>
  )
}

export function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
      className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-150 focus:outline-none"
      style={{ background: on ? '#C8A84B' : 'rgba(0,0,0,0.15)' }}>
      <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-150"
        style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }} />
    </button>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-[17px] font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({ icon:Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={36} className="text-gray-300 mb-3" />
      <p className="font-medium text-gray-500">{title}</p>
      {desc && <p className="text-sm text-gray-400 mt-1">{desc}</p>}
    </div>
  )
}
