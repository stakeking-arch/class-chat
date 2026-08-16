import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'

type Message = {
  id: string
  content: string
  created_at: string
  user_id: string
  profiles?: { display_name: string }
}

export default function ChatWindow({ roomId, roomName, userId }: { roomId: string; roomName: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true

    supabase
      .from('messages')
      .select('id, content, created_at, user_id, profiles(display_name)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (active && data) setMessages(data as unknown as Message[])
      })

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        async payload => {
          const { data } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', payload.new.user_id)
            .single()
          setMessages(prev => [
            ...prev,
            { ...(payload.new as Message), profiles: { display_name: data?.display_name || 'Someone' } }
          ])
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const content = text
    setText('')
    const { error } = await supabase.from('messages').insert({ room_id: roomId, user_id: userId, content })
    if (error) console.error(error)
  }

  return (
    <div className="chat-window">
      <div className="chat-header">{roomName}</div>
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`bubble ${msg.user_id === userId ? 'mine' : ''}`}>
            {msg.user_id !== userId && <div className="bubble-name">{msg.profiles?.display_name}</div>}
            <div>{msg.content}</div>
            <div className="bubble-time">
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
