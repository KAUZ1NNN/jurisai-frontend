export const AREAS = {
  consumidor:     { label:'Consumidor',     color:'#378ADD', bg:'#E6F1FB', text:'#0C447C' },
  previdenciario: { label:'Previdenciário', color:'#7F77DD', bg:'#EEEDFE', text:'#534AB7' },
  bancario:       { label:'Bancário',       color:'#1D9E75', bg:'#E1F5EE', text:'#085041' },
}

export const CONVERSATIONS = [
  { id:'1', clientName:'Carlos Lima',    initials:'CL', phone:'(11) 9 9876-5432', area:'consumidor',     lastMessage:'Meu CPF foi negativado sem dever nada',          time:'14:22', status:'ia_ativa',  hasAlert:true,
    messages:[
      { id:'m1', text:'Boa tarde! Recebi uma notificação do Serasa dizendo que meu nome foi negativado. Não tenho dívida alguma. O que posso fazer?', dir:'in',  time:'14:18' },
      { id:'m2', text:'Boa tarde! Isso é chamado de negativação indevida. Você tem direito à exclusão imediata e pode entrar com ação de danos morais. Qual empresa realizou a negativação?', dir:'out', time:'14:18', sentBy:'ia', status:'sent' },
      { id:'m3', text:'Uma empresa chamada XYZ Cobranças. Nunca tive relação com eles.', dir:'in', time:'14:19' },
      { id:'m4', text:'Você poderia me informar seu CPF para verificarmos todos os apontamentos existentes?', dir:'out', time:'14:20', sentBy:'ia', status:'pending_review', alertReason:'cpf_requested' },
    ],
  },
  { id:'2', clientName:'Ana Souza',      initials:'AS', phone:'(21) 9 9765-4321', area:'bancario',       lastMessage:'Banco cobrou tarifa indevida no meu cartão',     time:'14:38', status:'ia_ativa',  hasAlert:false,
    messages:[
      { id:'m1', text:'Olá! Vi uma cobrança de R$ 35 no meu cartão que não autorizei.', dir:'in',  time:'14:35' },
      { id:'m2', text:'Olá, Ana! Cobranças não autorizadas configuram prática abusiva pelo CDC. O banco deve estornar o valor. Você já tentou contestar pelo app?', dir:'out', time:'14:36', sentBy:'ia', status:'sent' },
      { id:'m3', text:'Tentei, mas disseram que a tarifa está no contrato.', dir:'in',  time:'14:37' },
      { id:'m4', text:'Mesmo no contrato, a tarifa pode ser abusiva se não foi claramente informada. Qual banco e qual é o nome da tarifa no extrato?', dir:'out', time:'14:38', sentBy:'ia', status:'sent' },
    ],
  },
  { id:'3', clientName:'Beatriz Melo',   initials:'BM', phone:'(31) 9 9654-3210', area:'previdenciario', lastMessage:'Meu INSS foi negado, o que fazer?',              time:'14:05', status:'ia_ativa',  hasAlert:false,
    messages:[
      { id:'m1', text:'Meu auxílio-doença foi negado pela perícia. Tenho laudos médicos. O que faço?', dir:'in',  time:'14:00' },
      { id:'m2', text:'A negativa do INSS não é o fim. Há recurso administrativo (30 dias) ou ação judicial. Com laudos, as chances são boas. Qual é sua doença e há quanto tempo está em tratamento?', dir:'out', time:'14:01', sentBy:'ia', status:'sent' },
      { id:'m3', text:'Hérnia de disco grave, 8 meses de tratamento, não consigo trabalhar.', dir:'in',  time:'14:03' },
      { id:'m4', text:'Hérnia de disco é muito comum em reversões de negativa. O recurso tem boas chances. Quer agendar uma conversa com o Dr. Rafael para avaliarmos os documentos?', dir:'out', time:'14:05', sentBy:'ia', status:'sent' },
    ],
  },
  { id:'4', clientName:'Roberto Neto',   initials:'RN', phone:'(41) 9 9543-2109', area:'consumidor',     lastMessage:'Empresa jogou meu nome no SPC indevidamente',   time:'13:48', status:'assumido',  hasAlert:false,
    messages:[
      { id:'m1', text:'Meu nome foi para o SPC por uma dívida que já paguei há 3 meses.', dir:'in',  time:'13:40' },
      { id:'m2', text:'Após o pagamento a empresa tem 5 dias úteis para retirar o nome. Em 3 meses há direito a indenização por danos morais. Você tem o comprovante?', dir:'out', time:'13:41', sentBy:'ia', status:'sent' },
      { id:'m3', text:'Tenho o comprovante de transferência.', dir:'in', time:'13:44' },
      { id:'m4', text:'Perfeito! Com esse comprovante o caso é muito forte. Vou encaminhar para o Dr. Rafael.', dir:'out', time:'13:45', sentBy:'ia', status:'sent' },
    ],
  },
  { id:'5', clientName:'Juliana Reis',   initials:'JR', phone:'(51) 9 9432-1098', area:'previdenciario', lastMessage:'Preciso da carta de concessão do benefício',     time:'13:20', status:'ia_ativa',  hasAlert:true,
    messages:[
      { id:'m1', text:'Meu benefício foi aprovado mas preciso da carta de concessão para apresentar no trabalho.', dir:'in', time:'13:15' },
      { id:'m2', text:'A carta de concessão precisa ser elaborada diretamente pelo Dr. Rafael. Vou solicitar que ele entre em contato com você em breve.', dir:'out', time:'13:16', sentBy:'ia', status:'pending_review', alertReason:'document_requested' },
    ],
  },
  { id:'6', clientName:'Marcos Tavares', initials:'MT', phone:'(61) 9 9321-0987', area:'bancario',       lastMessage:'Financiamento com juros abusivos',               time:'11:45', status:'encerrado', hasAlert:false,
    messages:[
      { id:'m1', text:'Fiz um financiamento de veículo com juros muito altos. Posso questionar?', dir:'in',  time:'11:30' },
      { id:'m2', text:'Sim! Juros abusivos são questionáveis na Justiça comparando com a taxa média do Banco Central. Você tem o contrato?', dir:'out', time:'11:31', sentBy:'ia', status:'sent' },
      { id:'m3', text:'Tenho sim, vou enviar pelo WhatsApp.', dir:'in', time:'11:35' },
      { id:'m4', text:'Perfeito! O Dr. Rafael analisará e entra em contato. Qualquer dúvida, é só chamar!', dir:'out', time:'11:40', sentBy:'ia', status:'sent' },
    ],
  },
]

export const ALERTS = [
  { id:'a1', conversationId:'1', clientName:'Carlos Lima',  initials:'CL', area:'consumidor',     time:'14:20', type:'sensitive_data', typeLabel:'Dado pessoal sensível',     reason:'A mensagem solicita o CPF do cliente — dado pessoal sensível sujeito à LGPD.',                                                      draft:'Você poderia me informar seu CPF para que possamos verificar todos os apontamentos existentes?' },
  { id:'a2', conversationId:'5', clientName:'Juliana Reis', initials:'JR', area:'previdenciario', time:'13:16', type:'document',        typeLabel:'Solicitação de documento',   reason:'A cliente solicitou a carta de concessão do benefício — elaboração de documentos é responsabilidade exclusiva do advogado.', draft:'A carta de concessão precisa ser elaborada diretamente pelo Dr. Rafael. Vou solicitar que ele entre em contato em breve.' },
]

export const CLIENTS = [
  { id:'c1', name:'Marcos Tavares', initials:'MT', area:'bancario',       stage:'lead',     date:'Hoje'  },
  { id:'c2', name:'Fernanda Dias',  initials:'FD', area:'consumidor',     stage:'lead',     date:'Ontem' },
  { id:'c3', name:'Carlos Lima',    initials:'CL', area:'consumidor',     stage:'consulta', date:'19/06' },
  { id:'c4', name:'Beatriz Melo',   initials:'BM', area:'previdenciario', stage:'consulta', date:'18/06' },
  { id:'c5', name:'Roberto Neto',   initials:'RN', area:'consumidor',     stage:'proposta', date:'15/06' },
  { id:'c6', name:'Juliana Reis',   initials:'JR', area:'previdenciario', stage:'proposta', date:'14/06' },
  { id:'c7', name:'Ana Souza',      initials:'AS', area:'bancario',       stage:'fechado',  date:'10/06' },
  { id:'c8', name:'Paulo Mota',     initials:'PM', area:'consumidor',     stage:'fechado',  date:'07/06' },
  { id:'c9', name:'Cláudia Faria',  initials:'CF', area:'previdenciario', stage:'fechado',  date:'03/06' },
]

export const KANBAN_STAGES = [
  { id:'lead',     label:'Novo Lead'    },
  { id:'consulta', label:'Em Consulta' },
  { id:'proposta', label:'Com Proposta'},
  { id:'fechado',  label:'Fechado'     },
]

export const AUTOMATIONS = [
  { id:'au1', title:'Boas-vindas e triagem por área',       desc:'Classifica o cliente por área e inicia atendimento personalizado',              icon:'MessageCircle', on:true,  stat:'Sempre ativo · 38 triagens hoje' },
  { id:'au2', title:'Qualificação — Consumidor',            desc:'Coleta dados do problema e tentativas anteriores de resolução',                  icon:'ClipboardList', on:true,  stat:'12 leads qualificados hoje'      },
  { id:'au3', title:'Qualificação — Previdenciário',        desc:'Verifica tempo de contribuição, tipo de benefício e situação no INSS',           icon:'ClipboardList', on:true,  stat:'9 leads qualificados hoje'       },
  { id:'au4', title:'Qualificação — Bancário',              desc:'Levanta instituição, tipo de produto e valor envolvido',                         icon:'ClipboardList', on:true,  stat:'7 leads qualificados hoje'       },
  { id:'au5', title:'Follow-up após 48h sem resposta',      desc:'Reengaja clientes que pararam de responder',                                     icon:'Clock',         on:true,  stat:'4 disparos hoje'                 },
  { id:'au6', title:'Pesquisa de satisfação',               desc:'Enviada automaticamente ao encerrar cada atendimento',                           icon:'Star',          on:true,  stat:'Média 4.9 ⭐'                    },
  { id:'au7', title:'Lembrete de documentos pendentes',     desc:'Avisa o cliente sobre documentos que faltam para o caso',                        icon:'FileWarning',   on:false, stat:'Pausado'                         },
  { id:'au8', title:'Reengajamento de lead frio',           desc:'Retoma contato após 7 dias de inatividade total',                                icon:'RefreshCw',     on:false, stat:'Pausado'                         },
]

export const STATS = {
  activeConversations: 14,
  aiRate: 93,
  pendingAlerts: 2,
  totalClients: 52,
  weeklyConversations: [11,19,15,24,20,9,3],
  areaBreakdown: [
    { area:'Consumidor',    pct:48, color:'#378ADD' },
    { area:'Previdenciário',pct:33, color:'#7F77DD' },
    { area:'Bancário',      pct:19, color:'#1D9E75' },
  ],
  funnel:[
    { label:'Contatos recebidos',   value:101             },
    { label:'Triagem concluída',    value:98,  pct:'97%'  },
    { label:'Leads qualificados',   value:64,  pct:'65%'  },
    { label:'Consultas agendadas',  value:28,  pct:'44%'  },
    { label:'Contratos fechados',   value:11,  pct:'39%'  },
  ],
}
