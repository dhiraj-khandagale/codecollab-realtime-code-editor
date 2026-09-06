<<<<<<< HEAD
import { useState } from 'react' // State for modal and form data
import { useNavigate } from 'react-router-dom' // Router navigation helper
import { useProject } from '../context/ProjectContext' // Project context hook
import { useAuth } from '../context/AuthContext' // Authentication context hook
import Navbar from '../components/shared/Navbar' // Shared navigation bar component
import { Plus, Code2, Users, Calendar, Sparkles, Users2, Zap } from 'lucide-react' // Icons used in the dashboard
import toast from 'react-hot-toast' // Toast notifications
=======
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import { Plus, Code2, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
>>>>>>> origin/main

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', java: '#ed8b00',
  typescript: '#3178c6', default: '#7c6ff7'
<<<<<<< HEAD
} // Language badge colors

const FEATURES = [
  {
    id: 'ai-programmer',
    title: 'AI Pair Programmer',
    description: 'Get real-time AI assistance while coding. Get code explanations, bug fixes, and optimization suggestions.',
    icon: Sparkles,
    color: '#7c6ff7',
    route: '/ai-programmer'
  },
  {
    id: 'collaboration',
    title: 'Collaborative Coding',
    description: 'Work together in real-time with your team. Share code, sync changes, and collaborate seamlessly.',
    icon: Users2,
    color: '#34d399',
    route: '/collaborate'
  },
  {
    id: 'interview',
    title: 'Interview Mode',
    description: 'Practice coding problems with timer, monitoring, and performance metrics to ace your interviews.',
    icon: Zap,
    color: '#f97316',
    route: '/interview'
  },
]

export default function DashboardPage() {
  const { projects, createProject, openProject } = useProject() // Project list and actions
  const { user } = useAuth() // Current authenticated user
  const navigate  = useNavigate() // Navigation helper
  const [showModal, setShowModal] = useState(false) // State for create project modal
  const [form, setForm] = useState({ name: '', description: '', language: 'javascript' }) // Form fields

  const handleOpen = (project) => {
    openProject(project.id) // Set active project in context
    navigate(`/project/${project.id}`) // Go to project page
  }

  const handleCreate = () => {
    if (!form.name.trim()) { toast.error('Project name is required'); return } // Validation
    createProject(form.name, form.description, form.language) // Create new project
    toast.success('Project created!') // Success notification
    setShowModal(false) // Close modal
    setForm({ name: '', description: '', language: 'javascript' }) // Reset form
=======
}

export default function DashboardPage() {
  const { projects, createProject, openProject } = useProject()
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', language: 'javascript' })

  const handleOpen = (project) => {
    openProject(project.id)
    navigate(`/project/${project.id}`)
  }

  const handleCreate = () => {
    if (!form.name.trim()) { toast.error('Project name is required'); return }
    createProject(form.name, form.description, form.language)
    toast.success('Project created!')
    setShowModal(false)
    setForm({ name: '', description: '', language: 'javascript' })
>>>>>>> origin/main
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
<<<<<<< HEAD
      <Navbar /> {/* Shared navigation across authenticated pages */}

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Dashboard header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>Welcome back, {user?.name}</h1>
            <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>
              Choose a feature or open a project to get started
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Quick Access Features</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20
          }}>
            {FEATURES.map(feature => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={feature.id}
                  onClick={() => navigate(feature.route)}
                  style={{
                    background: '#1a1a1a', 
                    border: '1px solid #2a2a2a', 
                    borderRadius: 12,
                    padding: 24, 
                    cursor: 'pointer', 
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = feature.color
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 8px 16px rgba(124, 111, 247, 0.1)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#2a2a2a'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: 'rgba(124, 111, 247, 0.1)', 
                      border: `1px solid ${feature.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <IconComponent size={22} color={feature.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{feature.title}</h3>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>My Projects</h2>
            <button onClick={() => setShowModal(true)} style={{
              background: '#7c6ff7', border: 'none', borderRadius: 8,
              padding: '10px 20px', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontWeight: 600
            }}>
              <Plus size={16} /> New Project
            </button>
          </div>

          {/* Project cards grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20
          }}>
            {projects.length > 0 ? projects.map(project => (
              <div key={project.id} onClick={() => handleOpen(project)} style={{
                background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12,
                padding: 24, cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#7c6ff7'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: '#111', border: '1px solid #333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Code2 size={18} color={LANG_COLORS[project.language] || LANG_COLORS.default} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</h3>
                    <span style={{ fontSize: 12, color: LANG_COLORS[project.language] || LANG_COLORS.default }}>
                      {project.language}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
                  {project.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
                    <Users size={13} />
                    {project.members.length} member{project.members.length > 1 ? 's' : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
                    <Calendar size={13} />
                    {project.updatedAt}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 24px',
                color: '#666'
              }}>
                <p style={{ fontSize: 14, margin: 0 }}>No projects yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Project modal */}
=======
      <Navbar />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700 }}>My Projects</h1>
            <p style={{ color: '#666', marginTop: 4, fontSize: 14 }}>
              Welcome back, {user?.name}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            background: '#7c6ff7', border: 'none', borderRadius: 8,
            padding: '10px 20px', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 600
          }}>
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Project grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20
        }}>
          {projects.map(project => (
            <div key={project.id} onClick={() => handleOpen(project)} style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12,
              padding: 24, cursor: 'pointer', transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#7c6ff7'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: '#111', border: '1px solid #333',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Code2 size={18} color={LANG_COLORS[project.language] || LANG_COLORS.default} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{project.name}</h3>
                  <span style={{ fontSize: 12, color: LANG_COLORS[project.language] || LANG_COLORS.default }}>
                    {project.language}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
                  <Users size={13} />
                  {project.members.length} member{project.members.length > 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555' }}>
                  <Calendar size={13} />
                  {project.updatedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Project Modal */}
>>>>>>> origin/main
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            borderRadius: 16, padding: 32, width: 440
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>New Project</h2>

            {[
              { label: 'Project name', key: 'name', type: 'text', placeholder: 'my-awesome-project' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'What are you building?' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{
                    width: '100%', background: '#111', border: '1px solid #333',
                    borderRadius: 8, padding: '10px 14px', color: '#fff',
                    fontSize: 14, outline: 'none'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, color: '#aaa', display: 'block', marginBottom: 6 }}>Language</label>
              <select
                value={form.language}
                onChange={e => setForm(p => ({ ...p, language: e.target.value }))}
                style={{
                  width: '100%', background: '#111', border: '1px solid #333',
                  borderRadius: 8, padding: '10px 14px', color: '#fff',
                  fontSize: 14, outline: 'none'
                }}
              >
                {['javascript', 'typescript', 'python', 'java'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, background: 'none', border: '1px solid #333',
                borderRadius: 8, padding: '10px', color: '#aaa',
                cursor: 'pointer', fontSize: 14
              }}>Cancel</button>
              <button onClick={handleCreate} style={{
                flex: 1, background: '#7c6ff7', border: 'none',
                borderRadius: 8, padding: '10px', color: '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 600
              }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
