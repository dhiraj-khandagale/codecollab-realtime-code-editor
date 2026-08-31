import { useEffect, useRef, useState } from 'react' // React hooks for lifecycle, refs, and state
import { useParams, useNavigate } from 'react-router-dom' // Router hooks for route params and navigation
import { useProject } from '../context/ProjectContext' // Custom project context hook
import MenuBar    from '../components/editor/MenuBar' // Top editor menu bar
import FileTree   from '../components/editor/FileTree' // Sidebar file tree component
import TabBar     from '../components/editor/TabBar' // Editor tabs component
import CodeEditor from '../components/editor/CodeEditor' // Monaco code editor wrapper
import Footer     from '../components/editor/Footer' // VS Code-style footer panel
import toast from 'react-hot-toast' // Toast notifications

export default function ProjectPage() {
  const { projectId } = useParams() // Get the current project ID from the URL
  const { openProject, activeProject, activeTabData, editorSettings, updateEditorSetting } = useProject() // Project actions and current active project
  const navigate = useNavigate() // Navigation helper
  const editorRef = useRef(null) // Ref to the editor instance

  const {
    showSidebar,
    showMinimap,
    wordWrap,
    showFooter,
    footerHeight,
    theme,
  } = editorSettings

  useEffect(() => {
    openProject(projectId) // Load project data when route parameter changes
  }, [projectId])

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }, [theme])

  if (!activeProject) return (
    <div style={{ color: '#fff', padding: 40 }}>Loading project...</div> // Show loading state while project loads
  )

  const handleSave = () => toast.success('Saved! (mock ? no backend yet)') // Mock save action

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme === 'light' ? '#f4f4f7' : '#0f0f0f',
      color: theme === 'light' ? '#111' : '#e0e0e0',
    }}>
      {/* Page wrapper fills the viewport */}

      {/* VS Code-like top menu bar */}
      <MenuBar
        editorRef={editorRef} // Provide editor ref for menu actions
        onToggleSidebar={() => updateEditorSetting('showSidebar', !showSidebar)} // Toggle file tree
        onToggleMinimap={() => updateEditorSetting('showMinimap', !showMinimap)} // Toggle minimap
        onToggleWordWrap={() => updateEditorSetting('wordWrap', !wordWrap)} // Toggle word wrap
        onToggleTheme={() => updateEditorSetting('theme', theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Project navigation header */}
      <div style={{
        background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
        padding: '8px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            onClick={() => navigate('/dashboard')} // Navigate back to dashboard
            style={{ fontSize: 13, color: '#666', cursor: 'pointer' }}
          >Dashboard</span>
          <span style={{ color: '#333' }}>/</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{activeProject.name}</span> {/* Show active project name */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Member avatars */}
          <div style={{ display: 'flex', gap: 4 }}>
            {activeProject.members.map(m => (
              <div key={m.id} title={`${m.name} (${m.role})`} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#7c6ff7', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff'
              }}>
                {m.avatar} {/* Member initials */}
              </div>
            ))}
          </div>

          <button onClick={handleSave} style={{
            background: '#7c6ff7', border: 'none', borderRadius: 6,
            padding: '6px 16px', color: '#fff', cursor: 'pointer',
            fontSize: 13, fontWeight: 600
          }}>Save</button> {/* Mock save button */}
        </div>
      </div>

      {/* Main editor layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Optional file tree sidebar */}
        {showSidebar && (
          <div style={{
            width: 220,
            background: theme === 'light' ? '#f8f8fb' : '#141414',
            borderRight: '1px solid #222',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}>
            <FileTree />
          </div>
        )}

        {/* Center editor panel - full width */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar /> {/* Open file tabs */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor
              ref={editorRef}
              minimap={showMinimap}
              wordWrap={wordWrap}
            />
          </div>
        </div>
      </div>

      {/* Persistent footer section */}
      <Footer
        isVisible={showFooter} // Show or hide footer panel
        onToggle={() => updateEditorSetting('showFooter', !showFooter)} // Toggle footer open/close
        panelHeight={footerHeight} // Footer height prop
        onHeightChange={(height) => updateEditorSetting('footerHeight', height)} // Resize handler
      />
    </div>
  )
}
