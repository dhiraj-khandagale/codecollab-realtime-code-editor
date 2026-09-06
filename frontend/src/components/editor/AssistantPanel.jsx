import { useMemo, useState, useEffect, useRef } from 'react'
import { Sparkles, Bug, Code2, FileText, MessageCircle, BookOpen, Send, User, Bot, HelpCircle } from 'lucide-react'

const TOOL_ITEMS = [
  { id: 'explain', label: 'Explain my code', icon: Sparkles },
  { id: 'detectBug', label: 'Detect bug', icon: Bug },
  { id: 'optimize', label: 'Optimize code', icon: Code2 },
  { id: 'convertJava', label: 'Convert Java → Python', icon: FileText },
  { id: 'comments', label: 'Generate comments', icon: MessageCircle },
  { id: 'beginner', label: 'Beginner-friendly explanation', icon: BookOpen },
]

const sampleJavaToPython = (code) => {
  if (!code.trim()) {
    return 'Paste a Java snippet and this panel will produce a beginner-friendly Python equivalent.'
  }
  return `# Converted Java code to Python\n${code
    .replace(/public static void main\(String\[\] args\)/g, 'def main():')
    .replace(/System\.out\.println\(([^)]*)\);/g, 'print($1)')
    .replace(/String /g, '')
    .replace(/;/g, '')}`
}

const normalizeSnippet = (text) => text.trim() || 'the current file content'

const renderResponse = (action, snippet) => {
  const content = normalizeSnippet(snippet)
  switch (action) {
    case 'explain': {
      const summary = content.length > 60 ? 'a larger snippet that' : 'a small block that'
      return 'This code is ' + summary + ' defines behavior in a readable way. It usually sets up data structures, functions, or UI logic and is meant to run inside your project.'
    }
    case 'detectBug':
      return content.includes('==')
        ? 'Possible issue: using == instead of === can cause type coercion bugs in JavaScript. Use strict equality for reliable comparisons.'
        : content.includes('null') || content.includes('undefined')
          ? 'This code may be accessing something that is null or undefined. Make sure the value is initialized before using it.'
          : 'No obvious bug is visible from the selected snippet, but check that data values are defined before you use them and that all parentheses/brackets are balanced.'
    case 'optimize':
      return 'This code can often be simplified by removing repeated expressions, using helper functions, and reducing nested conditionals. Smaller functions are easier to read and maintain.'
    case 'convertJava':
      return sampleJavaToPython(content)
    case 'comments':
      return content
        .split('\n')
        .map(line => line.trim() ? '# ' + line : '')
        .join('\n') || 'Add comments above each meaningful line or block to explain what it does.'
    case 'beginner':
      return 'In simple terms, this code tells the program what to do step by step. Think of each line as an instruction: define data, then use it, then show results. If something is unclear, ask for the exact line number.'
    default:
      return 'Choose one of the assistant actions to get a helpful response.'
  }
}

export default function AssistantPanel({ editorRef, activeTabData, beginnerMode }) {
  const [activeTab, setActiveTab] = useState('tools') // 'tools' | 'chat'
  const [tool, setTool] = useState('explain')
  const [toolResponse, setToolResponse] = useState('Select an assistant action to get a friendly explanation.')
  
  // Custom Chat States
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi! I am your AI Coding Assistant. Ask me anything about your files, programming concepts, or how to fix a bug!', timestamp: 'Just now' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const selectedCode = useMemo(() => {
    try {
      const editor = editorRef?.current
      if (!editor) return activeTabData?.content || ''
      const selection = editor.getSelection()
      const model = editor.getModel()
      if (!selection || !model) return activeTabData?.content || ''
      const selected = model.getValueInRange(selection)
      return selected || activeTabData?.content || ''
    } catch {
      return activeTabData?.content || ''
    }
  }, [editorRef, activeTabData])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  const runTool = (id) => {
    setTool(id)
    setToolResponse(renderResponse(id, selectedCode))
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const userMessage = chatInput.trim()
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setChatInput('')
    setIsTyping(true)

    // Simulate AI thinking and streaming response
    setTimeout(() => {
      let replyText = ''
      const lower = userMessage.toLowerCase()

      if (lower.includes('fibonacci') || lower.includes('prime')) {
        replyText = "The Fibonacci function in your file has a complexity of O(2^n), which is slow. You can optimize it using Memoization or an iterative approach. As for primes, checking all divisors takes O(n^2), but checking only up to the square root takes O(n√n)!"
      } else if (lower.includes('recursion') || lower.includes('recursive')) {
        replyText = "Recursion is a programming technique where a function calls itself. Always ensure you have a 'base case' to stop the recursion, otherwise you'll encounter a RangeError: Maximum call stack size exceeded."
      } else if (lower.includes('bug') || lower.includes('error') || lower.includes('fail')) {
        replyText = "Let's debug it! Make sure you are checking null pointer edge cases, verifying type conversion, and running strict equality checks (===) in JavaScript."
      } else {
        replyText = "That's an interesting question! Keeping code modular, adding clean docstrings, and dividing complex tasks into smaller functions is generally the best approach. Would you like me to write a template for this logic?"
      }

      // Stream the response letter by letter
      let currentLength = 0
      const botMessageId = Date.now() + 1
      
      setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '', timestamp: 'Just now' }])
      setIsTyping(false)

      const timer = setInterval(() => {
        currentLength += 2
        setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: replyText.slice(0, currentLength) } : m))
        if (currentLength >= replyText.length) {
          clearInterval(timer)
        }
      }, 15)
    }, 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#121217', color: '#fff' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 16px 12px 16px', borderBottom: '1px solid #222' }}>
        <Sparkles size={18} color="#7c6ff7" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>AI Pair Programmer</div>
          <div style={{ fontSize: 11, color: '#888' }}>Real-time explanations & chat support</div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222', background: '#0e0e12' }}>
        <button 
          onClick={() => setActiveTab('tools')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
            color: activeTab === 'tools' ? '#7c6ff7' : '#888',
            borderBottom: activeTab === 'tools' ? '2px solid #7c6ff7' : 'none',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none'
          }}
        >
          Quick Tools
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{
            flex: 1, padding: '10px 0', border: 'none', background: 'transparent',
            color: activeTab === 'chat' ? '#7c6ff7' : '#888',
            borderBottom: activeTab === 'chat' ? '2px solid #7c6ff7' : 'none',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none'
          }}
        >
          Interactive Chat
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
        {activeTab === 'tools' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TOOL_ITEMS.map(item => {
                const Icon = item.icon
                return (
                  <button 
                    key={item.id} 
                    type="button" 
                    onClick={() => runTool(item.id)} 
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: tool === item.id ? '#7c6ff7' : '#1b1b22',
                      color: tool === item.id ? '#fff' : '#ccc',
                      border: '1px solid #2c2c3c', padding: '10px 12px', borderRadius: 8,
                      cursor: 'pointer', fontSize: 11, textAlign: 'left', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (tool !== item.id) e.currentTarget.style.borderColor = '#7c6ff7'
                    }}
                    onMouseLeave={e => {
                      if (tool !== item.id) e.currentTarget.style.borderColor = '#2c2c3c'
                    }}
                  >
                    <Icon size={13} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div style={{ 
              padding: 14, borderRadius: 10, background: '#0e0e13', 
              border: '1px solid #232330', minHeight: 180, fontSize: 13, 
              lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#ddd' 
            }}>
              {toolResponse}
            </div>

            <div style={{ fontSize: 11, color: '#666', lineHeight: 1.4, marginTop: 4 }}>
              {beginnerMode 
                ? 'Beginner mode is active: the assistant will explain concepts more slowly.' 
                : 'Highlight code in the editor and click a tool above to analyze it instantly.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
              {messages.map(m => (
                <div 
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: m.sender === 'user' ? 'row-reverse' : 'row',
                    gap: 8,
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: m.sender === 'user' ? '#7c6ff7' : '#1f1f2e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {m.sender === 'user' ? <User size={12} color="#fff" /> : <Bot size={12} color="#7c6ff7" />}
                  </div>

                  <div style={{
                    maxWidth: '80%',
                    background: m.sender === 'user' ? '#7c6ff7' : '#1e1e26',
                    color: '#fff',
                    padding: '10px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    lineHeight: 1.5,
                    border: m.sender === 'user' ? 'none' : '1px solid #2a2a38'
                  }}>
                    {m.text}
                    <div style={{ fontSize: 9, color: m.sender === 'user' ? '#e0e0ff' : '#666', marginTop: 4, textAlign: 'right' }}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#1f1f2e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Bot size={12} color="#7c6ff7" />
                  </div>
                  <div style={{ background: '#1e1e26', padding: '10px 14px', borderRadius: 12, border: '1px solid #2a2a38' }}>
                    <span className="animate-pulse" style={{ fontSize: 12, color: '#888' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #222', paddingTop: 10 }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about variables, recursion, optimizations..."
                style={{
                  flex: 1, background: '#0e0e13', border: '1px solid #2a2a3c',
                  borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12,
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleSendChat}
                style={{
                  background: '#7c6ff7', border: 'none', borderRadius: 8,
                  width: 34, height: 34, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#fff'
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
