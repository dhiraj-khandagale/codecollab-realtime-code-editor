import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import { Plus, Code2, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const LANG_COLORS = {
  javascript: '#f7df1e', python: '#3776ab', java: '#ed8b00',
  typescript: '#3178c6', default: '#7c6ff7'
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
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f' }}>
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
}