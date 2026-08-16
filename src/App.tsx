import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import RoomList from './components/RoomList'
import ChatWindow from './components/ChatWindow'

type Room = { id: string; name: string }

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const [showRoomsOnMobile, setShowRoomsOnMobile] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <div className="loading-screen">Loading...</div>
  if (!session) return <Auth />

  const userId = session.user.id

  return (
    <div className="app-shell">
      <div className={`sidebar ${showRoomsOnMobile ? '' : 'hide-mobile'}`}>
        <div className="sidebar-header">
          <span>Class Chat</span>
          <button className="logout-btn" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
        <RoomList
          activeRoomId={activeRoom?.id ?? null}
          onSelect={room => {
            setActiveRoom(room)
            setShowRoomsOnMobile(false)
          }}
        />
      </div>
      <div className={`main-panel ${showRoomsOnMobile ? 'hide-mobile' : ''}`}>
        {activeRoom ? (
          <>
            <button className="back-btn" onClick={() => setShowRoomsOnMobile(true)}>&larr; Rooms</button>
            <ChatWindow roomId={activeRoom.id} roomName={activeRoom.name} userId={userId} />
          </>
        ) : (
          <div className="empty-state">Select a room to start chatting</div>
        )}
      </div>
    </div>
  )
}
