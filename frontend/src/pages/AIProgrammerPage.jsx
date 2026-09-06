import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import FileTree from '../components/editor/FileTree'
import TabBar from '../components/editor/TabBar'
import CodeEditor from '../components/editor/CodeEditor'
import Footer from '../components/editor/Footer'
import AssistantPanel from '../components/editor/AssistantPanel'
import toast from 'react-hot-toast'
import { Columns2, Eye, Sun, Moon, CornerDownRight, ChevronLeft, Save, Sparkles } from 'lucide-react'

export default function AIProgrammerPage() {
  const { openProject, activeProject, activeTabData, editorSettings, updateEditorSetting } = useProject()
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
    openProject('proj-ai') // Load specialized AI workspace
  }, [])

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }, [theme])

  if (!activeProject || activeProject.id !== 'proj-ai') {
    return (
      <div style={{ color: '#fff', padding: 40, background: '#0f0f0f', height: '100vh' }}>
        Loading AI Assistant Workspace...
      </div>
    )
  }

  const handleSave = () => toast.success('Workspace saved! (mock)')

  const iconButtonStyle = (isActive) => ({
    background: isActive ? 'rgba(124, 111, 247, 0.15)' : 'transparent',
    border: 'none',
    borderRadius: 6,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isActive ? '#7c6ff7' : '#888',
    transition: 'all 0.2s',
  })

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme === 'light' ? '#f4f4f7' : '#0f0f0f',
      color: theme === 'light' ? '#111' : '#e0e0e0',
      overflow: 'hidden',
    }}>
      
      {/* Sleek Header Bar (Replacing the heavy MenuBar dropdowns) */}
      <div style={{
        background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
        padding: '12px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0
      }}>
        
        {/* Left Side Breadcrumbs & Back Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#0f0f0f', border: '1px solid #2a2a2a', borderRadius: 8,
              padding: '6px 12px', color: '#ccc', cursor: 'pointer', fontSize: 12,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#7c6ff7'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2a2a2a'
              e.currentTarget.style.color = '#ccc'
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ color: '#333' }}>|</span>
          <span
            onClick={() => navigate('/dashboard')}
            style={{ fontSize: 13, color: '#888', cursor: 'pointer', fontWeight: 500 }}
            onMouseEnter={e => e.currentTarget.style.color = '#7c6ff7'}
            onMouseLeave={e => e.currentTarget.style.color = '#888'}
          >
            Dashboard
          </span>
          <span style={{ color: '#333' }}>/</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="#7c6ff7" /> AI Pair Programmer
          </span>
        </div>

        {/* Right Side Options & Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          
          {/* Quick Settings Icon Toggles Tray */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 4, 
            background: '#0f0f0f', padding: '4px 8px', borderRadius: 8, 
            border: '1px solid #2a2a2a' 
          }}>
            <button 
              onClick={() => updateEditorSetting('showSidebar', !showSidebar)}
              title="Toggle File Explorer sidebar"
              style={iconButtonStyle(showSidebar)}
              onMouseEnter={e => { if(!showSidebar) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if(!showSidebar) e.currentTarget.style.color = '#888' }}
            >
              <Columns2 size={14} />
            </button>
            <button 
              onClick={() => updateEditorSetting('showMinimap', !showMinimap)}
              title="Toggle Code Minimap"
              style={iconButtonStyle(showMinimap)}
              onMouseEnter={e => { if(!showMinimap) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if(!showMinimap) e.currentTarget.style.color = '#888' }}
            >
              <Eye size={14} />
            </button>
            <button 
              onClick={() => updateEditorSetting('wordWrap', !wordWrap)}
              title="Toggle Word Wrapping"
              style={iconButtonStyle(wordWrap)}
              onMouseEnter={e => { if(!wordWrap) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if(!wordWrap) e.currentTarget.style.color = '#888' }}
            >
              <CornerDownRight size={14} />
            </button>
            <button 
              onClick={() => updateEditorSetting('theme', theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
              style={iconButtonStyle(theme === 'dark')}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <span style={{ color: '#333' }}>|</span>

          {/* Member avatars */}
          <div style={{ display: 'flex', gap: 4 }}>
            {activeProject.members.map(m => (
              <div key={m.id} title={`${m.name} (${m.role})`} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: m.id === 'ai' ? 'rgba(124, 111, 247, 0.2)' : '#7c6ff7',
                border: m.id === 'ai' ? '1px solid #7c6ff7' : 'none',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff'
              }}>
                {m.avatar}
              </div>
            ))}
          </div>

          <button onClick={handleSave} style={{
            background: '#7c6ff7', border: 'none', borderRadius: 6,
            padding: '8px 18px', color: '#fff', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#6b5dd6'}
          onMouseLeave={e => e.currentTarget.style.background = '#7c6ff7'}
          >
            <Save size={13} /> Save Workspace
          </button>
        </div>
      </div>

      {/* Main Workspace split panel */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Optional Collapsible Sidebar (File Tree) */}
        {showSidebar && (
          <div style={{
            width: 230,
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

        {/* Center Panel (TabBar + Monaco CodeEditor) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TabBar />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <CodeEditor
              ref={editorRef}
              minimap={showMinimap}
              wordWrap={wordWrap}
            />
          </div>
        </div>

        {/* Right Panel (AI Assistant Panel) */}
        <div style={{
          width: 350,
          background: '#121217',
          borderLeft: '1px solid #222',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <AssistantPanel 
            editorRef={editorRef}
            activeTabData={activeTabData}
            beginnerMode={editorSettings.beginnerMode}
          />
        </div>
      </div>

      {/* VS Code Status Footer Panel */}
      <Footer
        isVisible={showFooter}
        onToggle={() => updateEditorSetting('showFooter', !showFooter)}
        panelHeight={footerHeight}
        onHeightChange={(height) => updateEditorSetting('footerHeight', height)}
      />
    </div>
  )
}
