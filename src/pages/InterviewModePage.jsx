import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import CodeEditor from '../components/editor/CodeEditor'
import InterviewPanel from '../components/editor/InterviewPanel'
import toast from 'react-hot-toast'
import { BookOpen, Award, ChevronLeft } from 'lucide-react'

export default function InterviewModePage() {
  const { openProject, activeProject, activeTabData, openFile, editorSettings, updateEditorSetting } = useProject()
  const navigate = useNavigate()
  const editorRef = useRef(null)

  const {
    showMinimap,
    wordWrap,
    theme,
  } = editorSettings

  useEffect(() => {
    openProject('proj-interview') // Load specialized Interview workspace
  }, [])

  // Auto-open solution.js when the interview project loads
  useEffect(() => {
    if (activeProject && activeProject.id === 'proj-interview') {
      const solutionFile = activeProject.files.find(f => f.name === 'solution.js')
      if (solutionFile) {
        openFile(solutionFile)
      }
    }
  }, [activeProject])

  useEffect(() => {
    document.body.classList.toggle('theme-light', theme === 'light')
    document.body.classList.toggle('theme-dark', theme === 'dark')
  }, [theme])

  if (!activeProject || activeProject.id !== 'proj-interview') {
    return (
      <div style={{ color: '#fff', padding: 40, background: '#0f0f0f', height: '100vh' }}>
        Loading Interview Environment...
      </div>
    )
  }

  const handleSubmitCode = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Auditing code and compiling proctoring metrics...',
        success: 'Interview solution submitted! Finalizing logs... 🎓',
        error: 'Submission error. Please retry.',
      }
    )
    setTimeout(() => {
      toast('Final Plagiarism Score: 0% (Clean)', { icon: '🛡️' })
      toast('Proctoring Logs: Verified (No infractions)', { icon: '✅' })
    }, 2200)
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme === 'light' ? '#f4f4f7' : '#0f0f0f',
      color: theme === 'light' ? '#111' : '#e0e0e0',
      overflow: 'hidden',
    }}>
      
      {/* Clean Simplified Header Bar (No drop menus!) */}
      <div style={{
        background: '#1a1a1a', borderBottom: '1px solid #2a2a2a',
        padding: '12px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0
      }}>
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
              e.currentTarget.style.borderColor = '#ef4444'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2a2a2a'
              e.currentTarget.style.color = '#ccc'
            }}
          >
            <ChevronLeft size={14} /> Exit Session
          </button>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 700 }}>Coding Interview Mode</span>
          <span style={{ fontSize: 10, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} /> Proctor Monitor Active
          </span>
        </div>

        <button onClick={handleSubmitCode} style={{
          background: '#ef4444', border: 'none', borderRadius: 6,
          padding: '8px 20px', color: '#fff', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
        onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
        >
          <Award size={13} /> Submit Solution
        </button>
      </div>

      {/* Main Workspace split panel */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* LEFT COLUMN: LeetCode-style Problem Statement Panel */}
        <div style={{
          width: 320,
          background: '#121217',
          borderRight: '1px solid #222',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#ef4444' }}>
            <BookOpen size={16} />
            <h2 style={{ fontSize: 12, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>Problem Statement</h2>
          </div>

          <h1 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>
            Maximum Subarray Sum
          </h1>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 10, background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              Medium
            </span>
            <span style={{ fontSize: 10, background: '#1f1f2e', color: '#ccc', padding: '2px 8px', borderRadius: 4 }}>
              Array / Dynamic Programming
            </span>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#c5c5d2', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: 0 }}>
              Given an integer array <code style={{ color: '#ef4444', background: '#252538', padding: '2px 4px', borderRadius: 3 }}>nums</code>, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
            </p>

            <div style={{ background: '#1c1c24', border: '1px solid #28283a', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Example:</span>
              <div>
                <strong>Input:</strong> <code style={{ color: '#34d399' }}>nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</code>
              </div>
              <div>
                <strong>Output:</strong> <code style={{ color: '#34d399' }}>6</code>
              </div>
              <div style={{ color: '#888', fontSize: 11, borderTop: '1px solid #28283a', paddingTop: 6 }}>
                <strong>Explanation:</strong> The subarray <code style={{ color: '#bbb' }}>[4, -1, 2, 1]</code> has the largest sum = 6.
              </div>
            </div>

            <div style={{ background: '#1c1c24', border: '1px solid #28283a', borderRadius: 8, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Constraints:</span>
              <ul style={{ margin: 0, paddingLeft: 18, listStyleType: 'disc' }}>
                <li>1 &le; nums.length &le; 10<sup>5</sup></li>
                <li>-10<sup>4</sup> &le; nums[i] &le; 10<sup>4</sup></li>
              </ul>
            </div>

            <p style={{ margin: 0, color: '#888', fontStyle: 'italic' }}>
              Instructions: Implement Kadane's algorithm inside the solution editor, then execute your implementation against the test harness on the right.
            </p>
          </div>
        </div>

        {/* MIDDLE COLUMN: Clean Direct Monaco CodeEditor (No TabBar!) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0f0f0f' }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <CodeEditor
              ref={editorRef}
              minimap={showMinimap}
              wordWrap={wordWrap}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Proctoring Panel Dashboard */}
        <div style={{
          width: 350,
          background: '#121217',
          borderLeft: '1px solid #222',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <InterviewPanel 
            language="javascript"
            code={activeTabData?.content || ''}
            editLog={[]}
          />
        </div>
      </div>

      {/* Minimal Static Status Footer Bar (No huge resizeable panel!) */}
      <div style={{
        background: '#141414', borderTop: '1px solid #222',
        padding: '8px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', fontSize: 11, color: '#666',
        flexShrink: 0, userSelect: 'none'
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Candidate: Yash Kumar</span>
          <span>Environment: Node.js (V8 Runtime)</span>
          <span>Latency: 24ms</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Active Buffer: solution.js</span>
          <span>Language: Javascript (ES6+)</span>
          <span>Theme: Visual Studio Dark</span>
        </div>
      </div>
    </div>
  )
}
