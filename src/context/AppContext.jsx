import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useJurisSocket } from '../hooks/useJurisSocket'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [alerts,        setAlerts]        = useState([])
  const [conversations, setConversations] = useState([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([api.alerts.list(), api.conversations.list()])
      .then(([a,c]) => { setAlerts(a ?? []); setConversations(c ?? []) })
      .finally(() => setLoading(false))
  }, [])

  const handleWsEvent = useCallback((event) => {
    switch (event.type) {
      case 'NEW_MESSAGE':
      case 'CONVERSATION_UPDATED':
        setConversations(prev => {
          const exists = prev.find(c => c.id === event.conversation?.id)
          return exists
            ? prev.map(c => c.id === event.conversation.id ? {...c,...event.conversation} : c)
            : [event.conversation, ...prev]
        })
        break
      case 'ALERT_CREATED':
        setAlerts(prev => [event.alert, ...prev])
        setConversations(prev => prev.map(c => c.id === event.alert.conversation_id ? {...c, hasAlert:true} : c))
        break
      case 'ALERT_RESOLVED':
        setAlerts(prev => prev.filter(a => a.id !== event.alertId))
        break
      case 'AI_REPLIED':
        setConversations(prev => prev.map(c => c.id === event.conversationId
          ? {...c, lastMessage: event.message?.text?.slice(0,80), time: new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
          : c))
        break
    }
  }, [])

  useJurisSocket(handleWsEvent)

  function resolveAlert(id) { setAlerts(prev => prev.filter(a => a.id !== id)) }

  return (
    <AppCtx.Provider value={{ alerts, conversations, setConversations, resolveAlert, loading }}>
      {children}
    </AppCtx.Provider>
  )
}

export const useApp = () => useContext(AppCtx)
