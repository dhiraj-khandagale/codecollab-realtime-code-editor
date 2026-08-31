<<<<<<< HEAD
import { useNavigate } from 'react-router-dom' // Navigation hook for SPA routing
import { Code2, Users, Zap } from 'lucide-react' // Icons for the landing page

export default function LandingPage() {
  const navigate = useNavigate() // Router navigation helper

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff' }}> {/* Full-page dark background */}
=======
import { useNavigate } from 'react-router-dom'
import { Code2, Users, Zap } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#fff' }}>
>>>>>>> origin/main
      {/* Header */}
      <header style={{
        padding: '16px 40px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e1e1e'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
<<<<<<< HEAD
          <Code2 size={24} color="#7c6ff7" /> {/* App logo icon */}
          <span style={{ fontSize: 20, fontWeight: 700 }}>CodeCollab</span> {/* Brand name */}
        </div>

=======
          <Code2 size={24} color="#7c6ff7" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>CodeCollab</span>
        </div>
        
>>>>>>> origin/main
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: '1px solid #333', borderRadius: 8,
            padding: '8px 20px', color: '#ccc', cursor: 'pointer', fontSize: 14
<<<<<<< HEAD
          }}>Login</button> {/* Navigate to login page */}
=======
          }}>Login</button>
>>>>>>> origin/main
          <button onClick={() => navigate('/register')} style={{
            background: '#7c6ff7', border: 'none', borderRadius: 8,
            padding: '8px 20px', color: '#fff', cursor: 'pointer',
            fontSize: 14, fontWeight: 600
<<<<<<< HEAD
          }}>Get Started</button> {/* Navigate to registration */}
        </div>
      </header>

      {/* Hero section */}
      <main style={{ textAlign: 'center', padding: '100px 40px 60px' }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Code Together,<br />
          <span style={{ color: '#7c6ff7' }}>Build Faster</span> {/* Highlighted subtext */}
        </h1>
        <p style={{ fontSize: 18, color: '#888', maxWidth: 520, margin: '0 auto 40px' }}>
          A real-time code collaboration platform. Write, share, and review code with your team ? all in the browser.
=======
          }}>Get Started</button>
        </div>
      </header>

      {/* Hero */}
      <main style={{ textAlign: 'center', padding: '100px 40px 60px' }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
          Code Together,<br />
          <span style={{ color: '#7c6ff7' }}>Build Faster</span>
        </h1>
        <p style={{ fontSize: 18, color: '#888', maxWidth: 520, margin: '0 auto 40px' }}>
          A real-time code collaboration platform. Write, share, and review code with your team — all in the browser.
>>>>>>> origin/main
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#7c6ff7', border: 'none', borderRadius: 10,
          padding: '14px 36px', color: '#fff', fontSize: 16,
          fontWeight: 600, cursor: 'pointer'
        }}>
          Start Coding Free
<<<<<<< HEAD
        </button> {/* Primary CTA */}
=======
        </button>
>>>>>>> origin/main

        {/* Feature cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24, maxWidth: 800, margin: '80px auto 0'
        }}>
          {[
            { icon: <Code2 size={28} color="#7c6ff7" />, title: 'Rich Code Editor', desc: 'Syntax highlighting, autocomplete, and multi-language support powered by Monaco.' },
            { icon: <Users size={28} color="#7c6ff7" />, title: 'Real-time Collab', desc: 'Invite teammates and see their cursors and edits live as they happen.' },
            { icon: <Zap size={28} color="#7c6ff7" />, title: 'Project Management', desc: 'Organise your work into projects with full file tree support.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 12, padding: 28, textAlign: 'left'
            }}>
<<<<<<< HEAD
              {f.icon} {/* Feature icon */}
=======
              {f.icon}
>>>>>>> origin/main
              <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 14, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
