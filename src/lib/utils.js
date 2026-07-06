export function getAreaStyle(area) {
  const map = {
    consumidor:     { label:'Consumidor',     bg:'#E6F1FB', color:'#0C447C' },
    previdenciario: { label:'Previdenciário', bg:'#EEEDFE', color:'#534AB7' },
    bancario:       { label:'Bancário',       bg:'#E1F5EE', color:'#085041' },
  }
  return map[area] ?? { label: area ?? '—', bg:'#f3f4f6', color:'#6b7280' }
}
