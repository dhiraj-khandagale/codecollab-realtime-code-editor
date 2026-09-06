
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Fill in all fields')
      return
    }

    const ok = login(email, password)

    if (ok) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 16,
          padding: 40,
          width: '100%',
          maxWidth: 420,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <Code2 size={32} color="#7c6ff7" />

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginTop: 12,
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: '#666',
              fontSize: 14,
              marginTop: 6,
            }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            {
              label: 'Email',
              type: 'email',
              value: email,
              set: setEmail,
              placeholder: 'you@example.com',
            },
            {
              label: 'Password',
              type: 'password',
              value: password,
              set: setPassword,
              placeholder: '••••••••',
            },
          ].map((field) => (
            <div
              key={field.label}
              style={{
                marginBottom: 16,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  color: '#aaa',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {field.label}
              </label>

              <input
                type={field.type}
                value={field.value}
                placeholder={field.placeholder}
                onChange={(e) => field.set(e.target.value)}
                style={{
                  width: '100%',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#7c6ff7',
              border: 'none',
              borderRadius: 8,
              padding: '12px',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Sign In
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 14,
            color: '#666',
          }}
        >
          No account?{' '}
          <Link
            to="/register"
            style={{ color: '#7c6ff7' }}
          >
            Register here
          </Link>
        </p>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: '#111',
            borderRadius: 8,
            fontSize: 12,
            color: '#555',
            textAlign: 'center',
          }}
        >
          Demo: use any email + password to login
        </div>
      </div>
    </div>
  )
}
