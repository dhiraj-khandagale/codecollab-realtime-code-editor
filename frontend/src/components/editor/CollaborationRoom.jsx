import { useEffect, useMemo, useState, useRef } from 'react'
import { Share2, Users, MessageSquare, Link2, Play, Square, Activity, ShieldAlert } from 'lucide-react'
import { useProject } from '../../context/ProjectContext'
import toast from 'react-hot-toast'

const INITIAL_PARTICIPANTS = [
  { id: 1, name: 'Aisha (Editor)', status: 'active', color: '#34d399' },
  { id: 2, name: 'Ravi (Reviewer)', status: 'active', color: '#7c6ff7' },
  { id: 3, name: 'Mira (Navigator)', status: 'idle', color: '#f97316' },
]

const INITIAL_CHAT = [
  { id: 1, user: 'Aisha', message: 'I will start refactoring the processData module.', time: '2 min ago' },
  { id: 2, user: 'Ravi', message: 'Perfect, I will review line highlights and check imports.', time: '1 min ago' },
]

const SIMULATED_MESSAGES = [
  { user: 'Aisha', message: 'Just optimized the processData loop. Check it out!' },
  { user: 'Ravi', message: 'Code looks clean. Added a couple of helper tests.' },
  { user: 'Mira', message: 'I am checking the requirements. We need to handle null values.' },
  { user: 'Aisha', message: 'Good catch! Let me add an edge case checker.' },
]

const SIMULATED_CODE_SNIPPETS = [
  `\n// Aisha: Added a robust null safety check\nfunction validateInput(items) {\n  if (!items || !Array.isArray(items)) {\n    console.warn("Invalid inputs received");\n    return [];\n  }\n  return items;\n}\n`,
  `\n// Ravi: Added multiply utility for processing\nfunction multiply(x, y) {\n  return x * y;\n}\n`,
  `\n// Aisha: Connected validateInput to processData\n// Checked and verified by team.\n`
]

export default function CollaborationRoom({ roomLink, onCopyLink }) {
  const { activeTabData, updateFileContent } = useProject()
  
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS)
  const [chat, setChat] = useState(INITIAL_CHAT)
  const [text, setText] = useState('')
  const [simActive, setSimActive] = useState(false)
  const chatListRef = useRef(null)

  const [liveCursors, setLiveCursors] = useState([
    { name: 'Aisha', file: 'src/collab.js', color: '#34d399' },
    { name: 'Ravi', file: 'src/collab.js', color: '#7c6ff7' },
  ])

  // Scroll chat list to bottom
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight
    }
  }, [chat, simActive])

  // Collaborator Simulator Effect
  useEffect(() => {
    if (!simActive) return undefined

    let step = 0
    const interval = setInterval(() => {
      // Step 1: Simulated Chat message
      if (step % 2 === 0) {
        const msgIdx = Math.floor(step / 2) % SIMULATED_MESSAGES.length
        const msg = SIMULATED_MESSAGES[msgIdx]
        setChat(prev => [...prev, {
          id: Date.now(),
          user: msg.user,
          message: msg.message,
          time: 'Just now'
        }])
        toast(`${msg.user}: "${msg.message.slice(0, 30)}..."`, { icon: '💬' })
      }

      // Step 2: Simulated Live Editor typing directly inside Monaco active file!
      if (step % 3 === 1) {
        if (activeTabData && activeTabData.type === 'file') {
          const snipIdx = Math.floor(step / 3) % SIMULATED_CODE_SNIPPETS.length
          const snippet = SIMULATED_CODE_SNIPPETS[snipIdx]
          
          updateFileContent(activeTabData.id, activeTabData.content + snippet)
          
          const typist = snipIdx % 2 === 0 ? 'Aisha' : 'Ravi'
          toast(`${typist} added code code to ${activeTabData.name}`, { icon: '📝' })
          
          // Shift cursors to show typing file focus
          setLiveCursors(prev => prev.map(c => c.name === typist ? { ...c, file: `src/${activeTabData.name}` } : c))
        }
      }

      // Step 3: Shift collaborator status/activities
      if (step % 4 === 2) {
        setParticipants(prev => prev.map((p, idx) => {
          if (idx === step % 3) {
            const nextStatus = p.status === 'active' ? 'idle' : 'active'
            return { ...p, status: nextStatus }
          }
          return p
        }))
      }

      step++
    }, 8000)

    return () => clearInterval(interval)
  }, [simActive, activeTabData, updateFileContent])

  const handleSend = () => {
    if (!text.trim()) return
    setChat(prev => [...prev, { id: Date.now(), user: 'You', message: text.trim(), time: 'Just now' }])
    setText('')

    // Simulated quick reply from Aisha
    if (!simActive) {
      setTimeout(() => {
        setChat(prev => [...prev, {
          id: Date.now(),
          user: 'Aisha',
          message: 'Nice! I see your message. Turn on "Simulate Collaborators" to start co-coding.',
          time: 'Just now'
        }])
      }, 1500)
    }
  }

  const toggleSimulation = () => {
    setSimActive(prev => {
      const next = !prev
      if (next) {
        toast.success('Live Collaborator Simulation Active!')
      } else {
        toast('Simulation Paused', { icon: '⏸️' })
      }
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#121217', color: '#fff' }}>
      
      {/* Collaboration Room Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 12px 16px', borderBottom: '1px solid #222' }}>
        <Users size={18} color="#34d399" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Collaborative Room</div>
          <div style={{ fontSize: 11, color: '#888' }}>Real-time team coding & sync</div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Room Share link info */}
        <div style={{ padding: 12, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#aaa', fontWeight: 600 }}>ROOM INVITE</span>
            <button 
              type="button" 
              onClick={onCopyLink} 
              style={{
                border: '1px solid #2c2c3c', borderRadius: 6, background: '#1b1b22',
                color: '#fff', padding: '4px 8px', display: 'inline-flex', alignItems: 'center',
                gap: 4, cursor: 'pointer', fontSize: 11
              }}
            >
              <Link2 size={12} /> Copy Link
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#d2d2dc', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {roomLink}
          </div>
        </div>

        {/* Live Simulator Panel Card */}
        <div style={{ 
          padding: 12, borderRadius: 10, background: 'rgba(52, 211, 153, 0.05)', 
          border: simActive ? '1px solid #34d399' : '1px solid rgba(52, 211, 153, 0.15)',
          display: 'flex', flexDirection: 'column', gap: 8 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={14} color="#34d399" className={simActive ? 'animate-pulse' : ''} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>Teammate Simulator</span>
            </div>
            <button 
              onClick={toggleSimulation}
              style={{
                background: simActive ? '#ef4444' : '#34d399',
                color: simActive ? '#fff' : '#000',
                border: 'none', borderRadius: 6,
                padding: '6px 12px', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
              }}
            >
              {simActive ? <Square size={10} /> : <Play size={10} />}
              {simActive ? 'Stop Simulation' : 'Simulate Teammates'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#888', margin: 0, lineHeight: 1.4 }}>
            {simActive 
              ? 'Teammates Aisha and Ravi are actively typing in files, editing code lines, and chatting!' 
              : 'Turn on simulation to see real-time updates inside your editor files & live group chat.'}
          </p>
        </div>

        {/* Participants & Live activity splits */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 8 }}>TEAMMATES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {participants.map(person => (
                <div key={person.id} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: 6, fontSize: 11 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: person.status === 'active' ? '#34d399' : '#666' }} />
                  <span style={{ color: '#ddd', flex: 1 }}>{person.name}</span>
                  <span style={{ color: person.status === 'active' ? '#34d399' : '#888', fontSize: 9 }}>{person.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 10, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 8 }}>LIVE FILE CURSORS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {liveCursors.map(cursor => (
                <div key={cursor.name} style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 11 }}>
                  <span style={{ color: '#eee', fontWeight: 600 }}>{cursor.name}</span>
                  <span style={{ color: cursor.color, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cursor.file}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>ROOM CHAT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34d399', fontSize: 10, fontWeight: 700 }}>
              <MessageSquare size={12} /> Sync Online
            </div>
          </div>

          {/* Messages list */}
          <div 
            ref={chatListRef}
            style={{ 
              flex: 1, maxHeight: 220, overflowY: 'auto', display: 'flex', 
              flexDirection: 'column', gap: 8, padding: 8, borderRadius: 10,
              background: '#0a0a0f', border: '1px solid #1a1a24', marginBottom: 8
            }}
          >
            {chat.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', flexDirection: 'column', gap: 2, 
                  padding: 8, borderRadius: 8, 
                  background: item.user === 'You' ? 'rgba(124, 111, 247, 0.08)' : '#161622',
                  border: item.user === 'You' ? '1px solid rgba(124, 111, 247, 0.2)' : '1px solid #252533',
                  alignSelf: item.user === 'You' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 9, color: '#888' }}>
                  <span style={{ fontWeight: 700, color: item.user === 'You' ? '#7c6ff7' : '#999' }}>{item.user}</span>
                  <span>{item.time}</span>
                </div>
                <div style={{ fontSize: 11, color: '#e5e7eb', lineHeight: 1.4 }}>{item.message}</div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div style={{ display: 'flex', gap: 6 }}>
            <input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type message to room..." 
              style={{ 
                flexGrow: 1, borderRadius: 8, border: '1px solid #2c2c3c', 
                background: '#0a0a0e', color: '#fff', padding: '8px 12px', fontSize: 12,
                outline: 'none'
              }} 
            />
            <button 
              onClick={handleSend} 
              style={{ 
                borderRadius: 8, border: 'none', background: '#34d399', 
                color: '#000', padding: '8px 12px', cursor: 'pointer',
                fontSize: 12, fontWeight: 700
              }}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
