import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useProject } from '../../context/ProjectContext'
import toast from 'react-hot-toast'

// Maps file language strings from our mock data to Monaco's language identifiers
const LANGUAGE_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python:     'python',
  java:       'java',
  css:        'css',
  json:       'json',
  plaintext:  'plaintext',
}

const CodeEditor = forwardRef(function CodeEditor({ minimap, wordWrap, onEditorEvent, onSelectionChange }, ref) {
  const { activeTabData, updateFileContent, setEditorPosition, createFile, openFile } = useProject()
  const editorInstanceRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Expose the raw Monaco editor instance so the MenuBar can call trigger()
  useImperativeHandle(ref, () => editorInstanceRef.current, [])

  const handleEditorMount = (editor) => {
    editorInstanceRef.current = editor
    editor.onDidChangeCursorPosition((event) => {
      setEditorPosition({
        lineNumber: event.position.lineNumber,
        column: event.position.column,
      })
      if (onSelectionChange) {
        onSelectionChange(editor.getSelection())
      }
    })

    editor.onDidChangeModelContent(() => {
      if (onEditorEvent) {
        onEditorEvent({
          type: 'edit',
          description: 'Updated code in the editor.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      
      // Basic text file type support
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result || ''
        const newFile = createFile(file.name, null, null, content)
        if (newFile) {
          openFile(newFile)
          toast.success(`Imported and opened "${file.name}"`)
        } else {
          toast.error('Failed to import file.')
        }
      }
      reader.onerror = () => {
        toast.error('Error reading dropped file.')
      }
      reader.readAsText(file)
    }
  }

  // When no file is selected, show a placeholder message with drop zone
  if (!activeTabData) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100%', color: '#555', fontSize: 13, fontFamily: 'monospace',
          background: '#0f0f0f', position: 'relative', cursor: 'default',
          textAlign: 'center', padding: 24, userSelect: 'none'
        }}
      >
        {isDragging && <DragOverlay />}
        Select a file from the explorer, or drop any local code file here to import.
      </div>
    )
  }

  // Determine the Monaco language from the file's language field
  const monacoLanguage = LANGUAGE_MAP[activeTabData.language] || 'plaintext'

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ height: '100%', position: 'relative' }}
    >
      {isDragging && <DragOverlay />}
      <Editor
        height="100%"
        language={monacoLanguage}
        value={activeTabData.content}
        theme="vs-dark"
        onChange={(value) => updateFileContent(activeTabData.id, value || '')}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          minimap: { enabled: minimap !== false },
          scrollBeyondLastLine: false,
          wordWrap: wordWrap ? 'on' : 'off',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          renderLineHighlight: 'all',
        }}
      />
    </div>
  )
})

function DragOverlay() {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(10, 10, 16, 0.92)',
      backdropFilter: 'blur(5px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14, zIndex: 1000,
      border: '2px dashed #7c6ff7', borderRadius: 8, margin: 10,
      transition: 'all 0.2s ease-in-out'
    }}>
      <div style={{ 
        background: 'rgba(124, 111, 247, 0.1)', border: '1px solid #7c6ff7', 
        width: 52, height: 52, borderRadius: '50%', display: 'flex', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c6ff7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Import File to Workspace</div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Drop your file here to edit immediately</div>
      </div>
    </div>
  )
}

export default CodeEditor
