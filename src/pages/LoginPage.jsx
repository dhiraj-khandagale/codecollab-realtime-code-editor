import { useState } from 'react' // Local state for input fields
import { useNavigate, Link } from 'react-router-dom' // Router helpers for navigation and links
import { useAuth } from '../context/AuthContext' // Auth context access
import { Code2 } from 'lucide-react' // App icon
import toast from 'react-hot-toast' // Notifications library

export default function LoginPage() {
  const [email, setEmail]       = useState('') // Email input value
  const [password, setPassword] = useState('') // Password input value
  const { login } = useAuth() // Login action
  const navigate  = useNavigate() // Navigation helper

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent browser page reload
    if (!email || !password) { toast.error('Fill in all fields'); return } // Simple validation
    const ok = login(email, password) // Perform login action
    if (ok) { toast.success('Welcome back!'); navigate('/dashboard') } // Navigate on success
    else toast.error('Invalid credentials') // Show error on failure
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: '#0f0f0f'
    }}>
      <div style={{
        background: '#1a1a1a', border: '1px solid #2a2a2a',
        borderRadius: 16, padding: 40, width: '100%', maxWidth: 420
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Code2 size={32} color="#7c6ff7" /> {/* Page icon */}
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>Welcome back</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '????????' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input
                type={f.type} value={f.value} placeholder={f.placeholder}
                onChange={e => f.set(e.target.value)}
                style={{
                  width: '100%', background: '#111', border: '1px solid #333',
                  borderRadius: 8, padding: '10px 14px', color: '#fff',
                  fontSize: 14, outline: 'none'
                }}
              />
            </div>
          ))}

          <button type="submit" style={{
            width: '100%', background: '#7c6ff7', border: 'none',
            borderRadius: 8, padding: '12px', color: '#fff',
            fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8
          }}>Sign In</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
          No account? <Link to="/register" style={{ color: '#7c6ff7' }}>Register here</Link>
        </p>

        <div style={{
          marginTop: 20, padding: 12, background: '#111', borderRadius: 8,
          fontSize: 12, color: '#555', textAlign: 'center'
        }}>
          Demo: use any email + password to login
        </div>
      </div>
    </div>
  )
}
