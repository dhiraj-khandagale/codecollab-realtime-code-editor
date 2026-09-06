import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import MenuBar from '../components/editor/MenuBar'
import FileTree from '../components/editor/FileTree'
import TabBar from '../components/editor/TabBar'
import CodeEditor from '../components/editor/CodeEditor'
import Footer from '../components/editor/Footer'
import toast from 'react-hot-toast'

export default function ProjectPage() {
  const { projectId } = useParams()
  const {
    openProject,
    activeProject,
    editorSettings,
    updateEditorSetting,
  } = useProject()

  const navigate = useNavigate()
  const editorRef = useRef(null)

  const {
    showSidebar,
    showMinimap,
    wordWrap,
    showFooter,
    footerHeight,
    theme,
  } = editorSettings

  useEffect(() => {
    openProject(projectId)
  }, [projectId])

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }, [theme])

  if (!activeProject) {
    return (
      <div style={{ color: '#fff', padding: 40 }}>
        Loading project...
      </div>
    )
  }

  const handleSave = () => {
    toast.success('Saved! (mock — no backend yet)')
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme === 'light' ? '#f4f4f7' : '#0f0f0f',
        color: theme === 'light' ? '#111' : '#e0e0e0',
      }}
    >
      <MenuBar
        editorRef={editorRef}
        onToggleSidebar={() =>
          updateEditorSetting('showSidebar', !showSidebar)
        }
        onToggleMinimap={() =>
          updateEditorSetting('showMinimap', !showMinimap)
        }
        onToggleWordWrap={() =>
          updateEditorSetting('wordWrap', !wordWrap)
        }
        onToggleTheme={() =>
          updateEditorSetting(
            'theme',
            theme === 'dark' ? 'light' : 'dark'
          )
        }
      />

      {/* Project navigation header */}
      <div
        style={{
          background: '#1a1a1a',
          borderBottom: '1px solid #2a2a2a',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            onClick={() => navigate('/dashboard')}
            style={{
              fontSize: 13,
              color: '#666',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </span>

          <span style={{ color: '#333' }}>/</span>

          <span
            style={{
              fontSize: 13,
              color: '#fff',
              fontWeight: 600,
            }}
          >
            {activeProject.name}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Member avatars */}
          <div style={{ display: 'flex', gap: 4 }}>
            {activeProject.members.map((m) => (
              <div
                key={m.id}
                title={`${m.name} (${m.role})`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#7c6ff7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {m.avatar}
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            style={{
              background: '#7c6ff7',
              border: 'none',
              borderRadius: 6,
              padding: '6px 16px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Main editor layout */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* File tree sidebar */}
        {showSidebar && (
          <div
            style={{
              width: 220,
              background:
                theme === 'light' ? '#f8f8fb' : '#141414',
              borderRight: '1px solid #222',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            <FileTree />
          </div>
        )}

        {/* Editor area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <TabBar />

          <div
            style={{
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <CodeEditor
              ref={editorRef}
              minimap={showMinimap}
              wordWrap={wordWrap}
            />
          </div>
        </div>

        {/* Members sidebar */}
        <div
          style={{
            width: 180,
            background: theme === 'light' ? '#f8f8fb' : '#141414',
            borderLeft: '1px solid #222',
            padding: 16,
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: theme === 'light' ? '#777' : '#444',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            Members
          </div>

          {activeProject.members.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: '#7c6ff7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  position: 'relative',
                }}
              >
                {m.avatar}

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '1.5px solid #141414',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: theme === 'light' ? '#333' : '#ccc',
                  }}
                >
                  {m.name.split(' ')[0]}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: theme === 'light' ? '#888' : '#555',
                  }}
                >
                  {m.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent footer */}
      <Footer
        isVisible={showFooter}
        onToggle={() =>
          updateEditorSetting('showFooter', !showFooter)
        }
        panelHeight={footerHeight}
        onHeightChange={(height) =>
          updateEditorSetting('footerHeight', height)
        }
      />
    </div>
  )
}