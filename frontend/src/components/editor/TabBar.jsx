import { useProject } from '../../context/ProjectContext'

export default function TabBar() {
  const { openTabs, activeTab, setActiveTab, closeTab } = useProject()

  if (openTabs.length === 0) {
    return (
      <div style={{ padding: '12px 16px', color: '#777', borderBottom: '1px solid #222' }}>
        Open a file from the file tree to start editing.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: '#141414', borderBottom: '1px solid #222', overflowX: 'auto' }}>
      {openTabs.map(file => (
        <div key={file.id} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: file.id === activeTab ? '#1f1f1f' : '#111',
          border: file.id === activeTab ? '1px solid #7c6ff7' : '1px solid #222',
          borderRadius: 8, padding: '8px 12px', cursor: 'pointer', minWidth: 120
        }}>
          <button onClick={() => setActiveTab(file.id)} style={{
            all: 'unset', cursor: 'pointer', color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {file.name}
          </button>
          <button onClick={() => closeTab(file.id)} style={{
            all: 'unset', cursor: 'pointer', color: '#999', fontSize: 14
          }}>×</button>
        </div>
      ))}
    </div>
  )
}
