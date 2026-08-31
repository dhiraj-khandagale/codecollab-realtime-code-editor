<<<<<<< HEAD
import { useState } from 'react' // State for registration form
import { useNavigate, Link } from 'react-router-dom' // Routing helpers
import { useAuth } from '../context/AuthContext' // Auth context hook
import { Code2 } from 'lucide-react' // App icon
import toast from 'react-hot-toast' // Toast library

export default function RegisterPage() {
  const [name, setName]         = useState('') // Full name input value
  const [email, setEmail]       = useState('') // Email input value
  const [password, setPassword] = useState('') // Password input value
  const { login } = useAuth() // Auth login function used for demo registration
  const navigate  = useNavigate() // Navigation helper

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent page reload
    if (!name || !email || !password) { toast.error('Fill in all fields'); return } // Validate fields
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return } // Validate password length
    login(email, password) // Log in demo user
    toast.success('Account created!') // Success feedback
    navigate('/dashboard') // Redirect to dashboard
=======
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('Fill in all fields'); return }
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return }
    login(email, password)
    toast.success('Account created!')
    navigate('/dashboard')
>>>>>>> origin/main
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
<<<<<<< HEAD
          <Code2 size={32} color="#7c6ff7" /> {/* Page icon */}
=======
          <Code2 size={32} color="#7c6ff7" />
>>>>>>> origin/main
          <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>Create account</h1>
          <p style={{ color: '#666', fontSize: 14, marginTop: 6 }}>Join CodeCollab today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full name', type: 'text', value: name, set: setName, placeholder: 'Yash Kumar' },
            { label: 'Email', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: 'Min 6 characters' },
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
          }}>Create Account</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#7c6ff7' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
