import { useEffect, useMemo, useState } from 'react'
import { Clock3, Terminal, ShieldCheck, Activity, Video, Mic, CheckCircle, XCircle, Play, FileCheck2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProject } from '../../context/ProjectContext'

const TEST_CASES = [
  { id: 1, name: 'Standard Array', input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6', status: 'pending' },
  { id: 2, name: 'All Positives', input: '[1, 2, 3, 4]', expected: '10', status: 'pending' },
  { id: 3, name: 'Single Negative', input: '[-5]', expected: '-5', status: 'pending' }
]

export default function InterviewPanel({ language, code, editLog }) {
  const { activeTabData } = useProject()
  const [seconds, setSeconds] = useState(2700) // 45:00 minutes count down
  const [running, setRunning] = useState(true)
  const [checked, setChecked] = useState(false)
  const [testCases, setTestCases] = useState(TEST_CASES)
  const [runningTests, setRunningTests] = useState(false)

  // Countdown timer logic
  useEffect(() => {
    if (!running) return undefined
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [running])

  const timerLabel = useMemo(() => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
    const secs = String(seconds % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }, [seconds])

  // Run Test Cases Simulation
  const handleRunTests = () => {
    setRunningTests(true)
    toast('Running candidate code against test harness...', { icon: '⚙️' })

    // Reset status to evaluating
    setTestCases(prev => prev.map(t => ({ ...t, status: 'running' })))

    setTimeout(() => {
      // Evaluate actual code content if possible, otherwise mock pass
      const codeContent = activeTabData?.content || ''
      const hasKadaneLogic = codeContent.includes('Math.max') && (codeContent.includes('for') || codeContent.includes('forEach'))
      
      setTestCases(prev => prev.map((t, idx) => {
        // Let's make standard Kadane's code pass, and fail if empty code or obviously incorrect
        const passed = codeContent.length > 100 && (hasKadaneLogic || idx < 2)
        return {
          ...t,
          status: passed ? 'passed' : 'failed',
          actual: passed ? t.expected : '0',
          duration: Math.floor(Math.random() * 8) + 2
        }
      }))
      
      setRunningTests(false)
      const hasFails = codeContent.length <= 100 || !hasKadaneLogic
      if (hasFails) {
        toast.error('Some test cases failed. Please review your implementation.')
      } else {
        toast.success('All test cases passed successfully!')
      }
    }, 1500)
  }

  const handleQualityCheck = () => {
    setChecked(true)
    toast.success('Smart Code Quality check complete!')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, background: '#121217', color: '#fff', height: '100%', overflowY: 'auto' }}>
      
      {/* Proctoring Webcam & Recording simulation */}
      <div style={{ padding: 12, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Video size={14} color="#ef4444" className="animate-pulse" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444' }}>WEB-PROCTORING LIVE</span>
          </div>
          <span style={{ fontSize: 9, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 6px', borderRadius: 4 }}>
            RECORDING
          </span>
        </div>
        
        {/* Simulated Camera Window */}
        <div style={{ 
          height: 120, borderRadius: 8, background: '#181822', border: '1px solid #2b2b3a',
          position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          {/* Simulated scanning animation line */}
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '1px', background: '#ef4444',
            top: '40%', opacity: 0.5, boxShadow: '0 0 8px #ef4444'
          }} />
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: '50%', background: '#7c6ff7',
              margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600, color: '#fff' 
            }}>
              YK
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#eee' }}>Yash Kumar</div>
            <div style={{ fontSize: 9, color: '#888' }}>Candidate Feed</div>
          </div>

          {/* Decibel audio meter visualizer */}
          <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', gap: 3, alignItems: 'center' }}>
            <Mic size={10} color="#34d399" />
            {[8, 14, 6, 18, 10].map((h, i) => (
              <div key={i} style={{ 
                width: 2, height: h, background: '#34d399', borderRadius: 1,
                animation: 'pulse 1.2s infinite ease-in-out', animationDelay: `${i * 0.15}s` 
              }} />
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 9, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} /> Live
          </div>
        </div>

        {/* Proctoring logs */}
        <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10 }}>
          <div style={{ color: '#888' }}>Face Tracked: <span style={{ color: '#34d399', fontWeight: 600 }}>100%</span></div>
          <div style={{ color: '#888' }}>Audio Noise: <span style={{ color: '#34d399', fontWeight: 600 }}>Low</span></div>
          <div style={{ color: '#888' }}>Tab Switches: <span style={{ color: '#34d399', fontWeight: 600 }}>0 / 3</span></div>
          <div style={{ color: '#888' }}>AI Guard Status: <span style={{ color: '#34d399', fontWeight: 600 }}>Clean</span></div>
        </div>
      </div>

      {/* Timer Display Card */}
      <div style={{ padding: 12, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>REMAINING TIME</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: seconds < 300 ? '#ef4444' : '#fff', fontFamily: 'monospace' }}>
            {timerLabel}
          </div>
        </div>
        <button 
          onClick={() => setRunning(p => !p)}
          style={{
            background: running ? 'rgba(239, 68, 68, 0.1)' : 'rgba(124, 111, 247, 0.1)',
            border: running ? '1px solid #ef4444' : '1px solid #7c6ff7',
            borderRadius: 6, padding: '6px 12px', color: running ? '#ef4444' : '#7c6ff7',
            fontSize: 11, fontWeight: 600, cursor: 'pointer'
          }}
        >
          {running ? 'Pause Timer' : 'Resume'}
        </button>
      </div>

      {/* Test Cases Harness */}
      <div style={{ padding: 12, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>TEST CASE HARNESS</span>
          <button 
            onClick={handleRunTests}
            disabled={runningTests}
            style={{
              background: '#7c6ff7', border: 'none', borderRadius: 6,
              padding: '6px 12px', color: '#fff', fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
            }}
          >
            <Play size={10} />
            {runningTests ? 'Evaluating...' : 'Run Test Cases'}
          </button>
        </div>

        {/* Test Case list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {testCases.map(tc => (
            <div key={tc.id} style={{ 
              padding: 10, borderRadius: 8, background: '#181822', border: '1px solid #252533',
              display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{tc.name}</span>
                <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {tc.status === 'pending' && <span style={{ color: '#888' }}>Pending</span>}
                  {tc.status === 'running' && <span style={{ color: '#7c6ff7' }} className="animate-pulse">Evaluating...</span>}
                  {tc.status === 'passed' && (
                    <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircle size={10} /> Passed ({tc.duration}ms)
                    </span>
                  )}
                  {tc.status === 'failed' && (
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <XCircle size={10} /> Failed
                    </span>
                  )}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 10, color: '#888', background: '#0e0e13', padding: 6, borderRadius: 4 }}>
                <div>Input: <span style={{ color: '#ccc', fontFamily: 'monospace' }}>{tc.input}</span></div>
                <div>Expected: <span style={{ color: '#34d399', fontFamily: 'monospace' }}>{tc.expected}</span></div>
                {tc.actual && <div>Actual: <span style={{ color: tc.status === 'passed' ? '#34d399' : '#ef4444', fontFamily: 'monospace' }}>{tc.actual}</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Session Check logs */}
      <div style={{ padding: 12, borderRadius: 10, background: '#0e0e13', border: '1px solid #232330' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <ShieldCheck size={14} color="#34d399" />
          <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>INTERVIEWER AUDIT ENGINE</span>
        </div>
        <div style={{ display: 'grid', gap: 8, fontSize: 11, color: '#ddd' }}>
          <div>Code Quality Analysis: <strong>{checked ? 'Syntactically Sound' : 'Pending Review'}</strong></div>
          <div>Readability Grade: <strong>{activeTabData?.content?.length > 150 ? 'Excellent' : 'Incomplete Code'}</strong></div>
          <div style={{ fontSize: 10, color: '#888', lineHeight: 1.4 }}>
            The AI Auditor tracks loops nested levels, semantic variable definitions, and complexity boundaries in real-time.
          </div>
        </div>
        {!checked && (
          <button 
            type="button" 
            onClick={handleQualityCheck} 
            style={{ 
              width: '100%', marginTop: 10, borderRadius: 6, border: 'none', 
              background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', 
              padding: '8px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700,
              border: '1px solid #34d399'
            }}
          >
            Audit Implementation
          </button>
        )}
      </div>

    </div>
  )
}
