import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 24px', background: '#111', borderBottom: '1px solid #222',
      color: '#fff', position: 'sticky', top: 0, zIndex: 50
    }}>
      <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', fontWeight: 700, fontSize: 18 }}>
        CodeCollab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#bbb', fontSize: 14 }}>{user?.name || 'Guest'}</span>
        <button onClick={() => { logout(); navigate('/login') }} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: '1px solid #333', color: '#fff',
          borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 13
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  )
}
