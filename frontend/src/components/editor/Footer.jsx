import { useState, useRef, useEffect, useCallback } from 'react'
import { useProject } from '../../context/ProjectContext'
import {
  Terminal, AlertTriangle, FileOutput, Bug,
  X, Maximize2, Minimize2, Plus, Trash2,
  ChevronDown, ChevronRight, AlertCircle, Info,
  GitBranch, Bell
} from 'lucide-react'
import './Footer.css'

/* ────────────────────────────────────────────
   Mock data for demo purposes
   ──────────────────────────────────────────── */

const MOCK_PROBLEMS = [
  {
    file: 'src/App.jsx',
    items: [
      { severity: 'error',   message: "'React' is defined but never used.",       line: 1, col: 8,  source: 'eslint(no-unused-vars)' },
      { severity: 'warning', message: "Missing key prop for element in iterator.", line: 12, col: 5, source: 'eslint(react/jsx-key)' },
    ]
  },
  {
    file: 'src/utils.js',
    items: [
      { severity: 'info',    message: "'capitalize' is exported but never used.", line: 5, col: 14, source: 'ts(6133)' },
    ]
  },
]

const INITIAL_OUTPUT = [
  { time: '14:02:31', text: '[vite] Dev server running at http://localhost:5173/', type: 'info' },
  { time: '14:02:31', text: '[vite] ready in 1302ms.', type: 'info' },
  { time: '14:02:33', text: '[vite] page reload — src/App.jsx', type: 'info' },
  { time: '14:02:35', text: '[vite] hmr update /src/components/editor/CodeEditor.jsx', type: 'info' },
  { time: '14:03:12', text: '[eslint] 1 error and 1 warning in 2 files', type: 'warn' },
]

const INITIAL_DEBUG = [
  { text: 'Debug session started.', type: 'log' },
  { text: 'Debugger attached to process 12847.', type: 'log' },
  { text: 'Listening on port 9229...', type: 'log' },
]

const WELCOME_LINES = [
  { text: '  ╔══════════════════════════════════════╗', type: 'info' },
  { text: '  ║       CodeCollab Terminal v1.0       ║', type: 'info' },
  { text: '  ║   Type "help" for available commands ║', type: 'info' },
  { text: '  ╚══════════════════════════════════════╝', type: 'info' },
  { text: '', type: 'info' },
]

/* ────────────────────────────────────────────
   Terminal commands (mock)
   ──────────────────────────────────────────── */

function processCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase()
  const parts = trimmed.split(/\s+/)
  const base = parts[0]

  switch (base) {
    case '':
      return []
    case 'help':
      return [
        { text: 'Available commands:', type: 'success' },
        { text: '  help          Show this help message', type: 'output' },
        { text: '  clear         Clear the terminal', type: 'output' },
        { text: '  ls            List project files', type: 'output' },
        { text: '  pwd           Print working directory', type: 'output' },
        { text: '  echo <text>   Print text to terminal', type: 'output' },
        { text: '  date          Show current date/time', type: 'output' },
        { text: '  whoami        Show current user', type: 'output' },
        { text: '  node -v       Show Node.js version', type: 'output' },
        { text: '  npm run dev   Start dev server', type: 'output' },
        { text: '  git status    Show git status', type: 'output' },
      ]
    case 'clear':
      return 'CLEAR'
    case 'ls':
      return [
        { text: 'src/  public/  node_modules/  dist/', type: 'output' },
        { text: 'package.json  vite.config.js  index.html  README.md', type: 'output' },
      ]
    case 'pwd':
      return [{ text: '/home/user/codecollab', type: 'output' }]
    case 'echo':
      return [{ text: parts.slice(1).join(' ') || '', type: 'output' }]
    case 'date':
      return [{ text: new Date().toString(), type: 'output' }]
    case 'whoami':
      return [{ text: 'yash@codecollab', type: 'success' }]
    case 'node':
      if (parts[1] === '-v') return [{ text: 'v20.11.0', type: 'output' }]
      return [{ text: `node: '${parts.slice(1).join(' ')}' is not recognized`, type: 'error' }]
    case 'npm':
      if (parts[1] === 'run' && parts[2] === 'dev') {
        return [
          { text: '> codecollab@0.0.0 dev', type: 'output' },
          { text: '> vite', type: 'output' },
          { text: '', type: 'output' },
          { text: '  VITE v8.0.14  ready in 843 ms', type: 'success' },
          { text: '', type: 'output' },
          { text: '  ➜  Local:   http://localhost:5173/', type: 'success' },
          { text: '  ➜  Network: use --host to expose', type: 'info' },
        ]
      }
      return [{ text: `npm: command '${parts.slice(1).join(' ')}' not recognized`, type: 'error' }]
    case 'git':
      if (parts[1] === 'status') {
        return [
          { text: 'On branch main', type: 'output' },
          { text: 'Changes not staged for commit:', type: 'output' },
          { text: '  modified:   src/components/editor/CodeEditor.jsx', type: 'error' },
          { text: '  modified:   src/pages/ProjectPage.jsx', type: 'error' },
          { text: '', type: 'output' },
          { text: 'Untracked files:', type: 'output' },
          { text: '  src/components/editor/MenuBar.jsx', type: 'success' },
          { text: '  src/components/editor/MenuBar.css', type: 'success' },
        ]
      }
      return [{ text: `git: '${parts[1]}' is not a git command`, type: 'error' }]
    default:
      return [{ text: `bash: ${base}: command not found`, type: 'error' }]
  }
}


/* ────────────────────────────────────────────
   Footer Panel Component
   ──────────────────────────────────────────── */

const TABS = [
  { id: 'terminal', label: 'Terminal',       icon: Terminal       },
  { id: 'problems', label: 'Problems',       icon: AlertTriangle  },
  { id: 'output',   label: 'Output',         icon: FileOutput     },
  { id: 'debug',    label: 'Debug Console',  icon: Bug            },
]

export default function Footer({ isVisible, onToggle, panelHeight, onHeightChange }) {
  const [activeTab, setActiveTab] = useState('terminal')

  // Terminal state
  const [termLines, setTermLines] = useState([...WELCOME_LINES])
  const [termInput, setTermInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const termOutputRef = useRef(null)

  // Output state
  const [outputLines] = useState(INITIAL_OUTPUT)

  // Debug state
  const [debugLines, setDebugLines] = useState([...INITIAL_DEBUG])
  const [debugInput, setDebugInput] = useState('')

  // Problem explanation state
  const [selectedProblem, setSelectedProblem] = useState(null)

  // Resize state
  const [isResizing, setIsResizing] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const resizeStartY = useRef(0)
  const resizeStartH = useRef(0)

  // Project context for status bar
  const { activeTabData, activeProject, editorPosition } = useProject()

  // Auto-scroll terminal
  useEffect(() => {
    if (termOutputRef.current) {
      termOutputRef.current.scrollTop = termOutputRef.current.scrollHeight
    }
  }, [termLines])

  /* ── Terminal input handling ── */
  const handleTerminalKey = (e) => {
    if (e.key === 'Enter') {
      const cmd = termInput
      const newLines = [
        ...termLines,
        { text: `$ ${cmd}`, type: 'command' }
      ]
      const result = processCommand(cmd)
      if (result === 'CLEAR') {
        setTermLines([])
      } else {
        setTermLines([...newLines, ...result])
      }
      if (cmd.trim()) {
        setCmdHistory(prev => [cmd, ...prev])
      }
      setTermInput('')
      setHistoryIdx(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length > 0) {
        const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1)
        setHistoryIdx(newIdx)
        setTermInput(cmdHistory[newIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1
        setHistoryIdx(newIdx)
        setTermInput(cmdHistory[newIdx])
      } else {
        setHistoryIdx(-1)
        setTermInput('')
      }
    }
  }

  /* ── Debug console input ── */
  const handleDebugKey = (e) => {
    if (e.key === 'Enter') {
      const expr = debugInput.trim()
      if (!expr) return
      const newLines = [...debugLines, { text: `> ${expr}`, type: 'log' }]
      // Simulate evaluation
      try {
        // Very basic expression eval for demo
        if (expr === 'console.log("hello")') {
          newLines.push({ text: 'hello', type: 'log' })
          newLines.push({ text: 'undefined', type: 'result' })
        } else if (expr.startsWith('Math.')) {
          newLines.push({ text: 'Math expressions are not executed in demo mode.', type: 'info' })
        } else if (/^\d[\d\s+\-*/().]*$/.test(expr)) {
          newLines.push({ text: 'Basic numeric evaluation is disabled in demo mode.', type: 'info' })
        } else {
          newLines.push({ text: `ReferenceError: ${expr.split(/[.(]/)[0]} is not defined`, type: 'error' })
        }
      } catch {
        newLines.push({ text: 'SyntaxError: Unexpected token', type: 'error' })
      }
      setDebugLines(newLines)
      setDebugInput('')
    }
  }

  /* ── Resize handling ── */
  const handleResizeStart = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    resizeStartY.current = e.clientY
    resizeStartH.current = panelHeight
  }, [panelHeight])

  useEffect(() => {
    if (!isResizing) return

    const handleMove = (e) => {
      const delta = resizeStartY.current - e.clientY
      const newHeight = Math.max(120, Math.min(600, resizeStartH.current + delta))
      onHeightChange(newHeight)
    }

    const handleUp = () => setIsResizing(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isResizing, onHeightChange])

  const explainProblem = (item) => {
    const prefix = item.severity === 'error' ? 'Fix this error by' : item.severity === 'warning' ? 'Consider' : 'Note that'
    if (item.message.includes('never used')) {
      return `${prefix} removing or using the declared variable so the compiler does not report dead code.`
    }
    if (item.message.includes('Missing key prop')) {
      return `${prefix} adding a unique key prop to each rendered child in the list to improve React rendering performance.`
    }
    return `${prefix} checking the code around line ${item.line} and making sure the value is correctly declared and used.`
  }

  /* ── Maximize toggle ── */
  const handleMaximize = () => {
    if (isMaximized) {
      onHeightChange(200)
      setIsMaximized(false)
    } else {
      onHeightChange(window.innerHeight * 0.6)
      setIsMaximized(true)
    }
  }

  /* ── Problem counts ── */
  const errorCount = MOCK_PROBLEMS.reduce((sum, g) => sum + g.items.filter(i => i.severity === 'error').length, 0)
  const warnCount  = MOCK_PROBLEMS.reduce((sum, g) => sum + g.items.filter(i => i.severity === 'warning').length, 0)
  const infoCount  = MOCK_PROBLEMS.reduce((sum, g) => sum + g.items.filter(i => i.severity === 'info').length, 0)

  if (!isVisible) return <StatusBar errorCount={errorCount} warnCount={warnCount} onToggle={onToggle} activeTabData={activeTabData} activeProject={activeProject} editorPosition={editorPosition} />

  return (
    <>
      <div
        className="footer-panel"
        style={{ height: panelHeight }}
      >
        {/* Resize handle */}
        <div
            className={`footer-panel-resize${isResizing ? ' dragging' : ''}`}
        />

        {/* Tab strip */}
        <div className="footer-panel-header">
          <div className="footer-panel-tabs">
            {TABS.map(tab => (
              <div
                key={tab.id}
                className={`footer-panel-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={14} />
                {tab.label}
                {tab.id === 'problems' && errorCount > 0 && (
                  <span className="footer-panel-tab-badge error">{errorCount}</span>
                )}
                {tab.id === 'problems' && warnCount > 0 && (
                  <span className="footer-panel-tab-badge warn">{warnCount}</span>
                )}
              </div>
            ))}
          </div>

          <div className="footer-panel-actions">
            {activeTab === 'terminal' && (
              <>
                <button
                  className="footer-panel-action-btn"
                  title="New Terminal"
                  onClick={() => setTermLines([...WELCOME_LINES])}
                >
                  <Plus size={14} />
                </button>
                <button
                  className="footer-panel-action-btn"
                  title="Clear Terminal"
                  onClick={() => setTermLines([])}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <button className="footer-panel-action-btn" title={isMaximized ? 'Restore' : 'Maximize'} onClick={handleMaximize}>
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button className="footer-panel-action-btn" title="Close Panel" onClick={onToggle}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Panel content */}
        <div className="footer-panel-content">
          {activeTab === 'terminal' && (
            <div className="terminal-container">
              <div className="terminal-output" ref={termOutputRef}>
                {termLines.map((line, i) => (
                  <div key={i} className={`terminal-line ${line.type}`}>{line.text}</div>
                ))}
              </div>
              <div className="terminal-prompt">
                <span className="terminal-prompt-symbol">❯</span>
                <span className="terminal-prompt-path">~/codecollab</span>
                <input
                  className="terminal-input"
                  value={termInput}
                  onChange={e => setTermInput(e.target.value)}
                  onKeyDown={handleTerminalKey}
                  placeholder="Type a command..."
                  autoFocus={activeTab === 'terminal'}
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="problems-container">
              {MOCK_PROBLEMS.length === 0 ? (
                <div className="panel-empty">No problems detected — nice work! ✨</div>
              ) : (
                MOCK_PROBLEMS.map((group, gi) => (
                  <div key={gi} className="problems-group">
                    <div className="problems-group-header">
                      <ChevronDown size={14} />
                      <span>{group.file}</span>
                      <span style={{ color: '#666', fontSize: 11 }}>({group.items.length})</span>
                    </div>
                    {group.items.map((item, ii) => (
                      <div
                        key={ii}
                        className={`problem-row${selectedProblem === item ? ' selected' : ''}`}
                        onClick={() => setSelectedProblem(item)}
                      >
                        <span className={`problem-icon ${item.severity}`}>
                          {item.severity === 'error' && <AlertCircle size={14} />}
                          {item.severity === 'warning' && <AlertTriangle size={14} />}
                          {item.severity === 'info' && <Info size={14} />}
                        </span>
                        <span className="problem-message">{item.message}</span>
                        <span className="problem-source">[{item.source}] Ln {item.line}, Col {item.col}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
              {selectedProblem && (
                <div className="problem-explanation">
                  <div className="problem-explanation-title">Explanation</div>
                  <div>{explainProblem(selectedProblem)}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'output' && (
            <div className="output-container">
              {outputLines.map((line, i) => (
                <div key={i} className={`output-line ${line.type || ''}`}>
                  <span className="timestamp">[{line.time}]</span>
                  {line.text}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="debug-container">
              <div className="debug-output">
                {debugLines.map((line, i) => (
                  <div key={i} className={`debug-line ${line.type}`}>{line.text}</div>
                ))}
              </div>
              <div className="debug-prompt">
                <span className="debug-prompt-icon">›</span>
                <input
                  className="debug-input"
                  value={debugInput}
                  onChange={e => setDebugInput(e.target.value)}
                  onKeyDown={handleDebugKey}
                  placeholder="Evaluate expression..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <StatusBar
        errorCount={errorCount}
        warnCount={warnCount}
        onToggle={onToggle}
        activeTabData={activeTabData}
        activeProject={activeProject}
        editorPosition={editorPosition}
      />
    </>
  )
}


/* ────────────────────────────────────────────
   Status Bar Component
   ──────────────────────────────────────────── */

function StatusBar({ errorCount, warnCount, onToggle, activeTabData, activeProject, editorPosition }) {
  const langDisplay = activeTabData?.language
    ? activeTabData.language.charAt(0).toUpperCase() + activeTabData.language.slice(1)
    : 'Plain Text'

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <div className="status-bar-item" title="Source Control">
          <span className="icon"><GitBranch size={13} /></span>
          main
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Errors and Warnings" onClick={onToggle}>
          <span className="icon"><AlertCircle size={13} /></span>
          {errorCount}
          <span className="icon" style={{ marginLeft: 6 }}><AlertTriangle size={13} /></span>
          {warnCount}
        </div>
      </div>

      <div className="status-bar-right">
        <div className="status-bar-item" title="Current line and column">
          Ln {editorPosition?.lineNumber || 1}, Col {editorPosition?.column || 1}
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Open file">
          {activeTabData?.name || 'No file'}
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Indentation">
          Spaces: 2
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Encoding">
          UTF-8
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="End of Line">
          LF
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Language Mode">
          {langDisplay}
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Active collaborators">
          {activeProject?.members?.length ?? 0} online
        </div>

        <div className="status-bar-separator" />

        <div className="status-bar-item" title="Toggle Terminal" onClick={onToggle}>
          <span className="icon"><Terminal size={13} /></span>
        </div>

        <div className="status-bar-item" title="Notifications">
          <span className="icon"><Bell size={13} /></span>
        </div>
      </div>
    </div>
  )
}
