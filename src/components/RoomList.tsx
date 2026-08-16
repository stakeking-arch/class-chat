import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

type Room = { id: string; name: string }

export default function RoomList({
  activeRoomId,
  onSelect
}: {
  activeRoomId: string | null
  onSelect: (room: Room) => void
}) {
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    supabase
      .from('rooms')
      .select('id, name')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setRooms(data)
          if (data.length && !activeRoomId) onSelect(data[0])
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="room-list">
      {rooms.map(room => (
        <button
          key={room.id}
          className={`room-item ${room.id === activeRoomId ? 'active' : ''}`}
          onClick={() => onSelect(room)}
        >
          <div className="room-avatar">{room.name.charAt(0).toUpperCase()}</div>
          <span>{room.name}</span>
        </button>
      ))}
    </div>
  )
}
