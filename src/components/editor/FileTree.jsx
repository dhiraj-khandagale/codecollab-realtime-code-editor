import { useState } from 'react'
import { useProject } from '../../context/ProjectContext'
import { FileText, Folder, FolderPlus, FilePlus, Edit3, Copy, Trash2 } from 'lucide-react'

const ITEM_ICON = {
  file: FileText,
  folder: Folder,
}

function FileNode({ item, level, expandedItems, toggleFolder, onSelect, selectedId, onContextMenu }) {
  const isFolder = item.type === 'folder'
  const Icon = ITEM_ICON[item.type] || FileText
  const isExpanded = expandedItems[item.id]
  const selected = selectedId === item.id

  return (
    <div style={{ paddingLeft: level * 14, marginBottom: 4 }}>
      <button
        type="button"
        onClick={() => {
          onSelect(item)
          if (isFolder) toggleFolder(item.id)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onSelect(item)
          onContextMenu(e, item)
        }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 10px',
          textAlign: 'left',
          borderRadius: 6,
          border: selected ? '1px solid #7c6ff7' : '1px solid transparent',
          background: selected ? '#1e1e2a' : 'transparent',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Icon size={14} />
        </span>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </span>
        {isFolder && (
          <span style={{ fontSize: 12, color: '#999' }}>
            {isExpanded ? '▾' : '▸'}
          </span>
        )}
      </button>
      {isFolder && isExpanded && item.children.map(child => (
        <FileNode
          key={child.id}
          item={child}
          level={level + 1}
          expandedItems={expandedItems}
          toggleFolder={toggleFolder}
          onSelect={onSelect}
          selectedId={selectedId}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  )
}

export default function FileTree() {
  const {
    activeProject,
    openFile,
    selectedFileId,
    selectedFileData,
    setSelectedFileId,
    createFile,
    createFolder,
    deleteFile,
    renameFile,
    duplicateFile,
  } = useProject()
  const [expandedItems, setExpandedItems] = useState({})
  const [contextMenu, setContextMenu] = useState(null)
  const [contextMenuFile, setContextMenuFile] = useState(null)

  const toggleFolder = (folderId) => {
    setExpandedItems(prev => ({ ...prev, [folderId]: !prev[folderId] }))
  }

  const handleSelect = (item) => {
    setSelectedFileId(item.id)
    if (item.type === 'file') openFile(item)
  }

  const handleCreateFile = () => {
    const name = window.prompt('New file name', 'untitled.js')
    if (!name) return
    const parentId = selectedFileData?.type === 'folder' ? selectedFileData.id : null
    createFile(name, parentId)
  }

  const handleCreateFolder = () => {
    const name = window.prompt('New folder name', 'new-folder')
    if (!name) return
    const parentId = selectedFileData?.type === 'folder' ? selectedFileData.id : null
    createFolder(name, parentId)
    if (selectedFileData?.type === 'folder') toggleFolder(selectedFileData.id)
  }

  const handleDelete = () => {
    const targetId = selectedFileId
    if (!targetId) return
    const confirmDelete = window.confirm('Delete selected file or folder?')
    if (confirmDelete) deleteFile(targetId)
  }

  const handleRename = () => {
    if (!selectedFileId) return
    const nextName = window.prompt('Enter new name', selectedFileData?.name || '')
    if (!nextName) return
    renameFile(selectedFileId, nextName)
  }

  const handleDuplicate = () => {
    if (!selectedFileId) return
    duplicateFile(selectedFileId)
    setContextMenu(null)
  }

  const handleContextMenu = (e, item) => {
    setContextMenu({ x: e.clientX, y: e.clientY })
    setContextMenuFile(item)
  }

  const handleContextMenuAction = (action) => {
    if (action === 'rename') handleRename()
    else if (action === 'delete') handleDelete()
    else if (action === 'duplicate') handleDuplicate()
    else if (action === 'newFile') handleCreateFile()
    else if (action === 'newFolder') handleCreateFolder()
    setContextMenu(null)
    setContextMenuFile(null)
  }

  if (!activeProject) {
    return <div style={{ color: '#ccc', padding: 16 }}>No project selected.</div>
  }

  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#777', marginBottom: 16 }}>Project Files</div>
        {activeProject.files.length === 0 ? (
          <div style={{ color: '#888', fontSize: 13 }}>This project has no files yet. Add a new file or folder to begin.</div>
        ) : (
          activeProject.files.map(item => (
            <FileNode
              key={item.id}
              item={item}
              level={0}
              expandedItems={expandedItems}
              toggleFolder={toggleFolder}
              onSelect={handleSelect}
              selectedId={selectedFileId}
              onContextMenu={handleContextMenu}
            />
          ))
        )}
      </div>

      {contextMenu && (
        <>
          {/* Click outside to close */}
          <div
            onClick={() => {
              setContextMenu(null)
              setContextMenuFile(null)
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          />
          {/* Context Menu */}
          <div
            style={{
              position: 'fixed',
              top: Math.min(contextMenu.y, window.innerHeight - 200),
              left: Math.min(contextMenu.x, window.innerWidth - 180),
              background: '#1e1e2a',
              border: '1px solid #333',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              zIndex: 1000,
              minWidth: 160,
            }}
          >
            {contextMenuFile?.type === 'folder' && (
              <>
                <ContextMenuItem icon={<FilePlus size={14} />} label="New File" onClick={() => handleContextMenuAction('newFile')} />
                <ContextMenuItem icon={<FolderPlus size={14} />} label="New Folder" onClick={() => handleContextMenuAction('newFolder')} />
                <div style={{ height: '1px', background: '#333', margin: '4px 0' }} />
              </>
            )}
            <ContextMenuItem icon={<Edit3 size={14} />} label="Rename" onClick={() => handleContextMenuAction('rename')} />
            <ContextMenuItem icon={<Copy size={14} />} label="Duplicate" onClick={() => handleContextMenuAction('duplicate')} />
            <ContextMenuItem icon={<Trash2 size={14} />} label="Delete" onClick={() => handleContextMenuAction('delete')} isDelete={true} />
          </div>
        </>
      )}
    </div>
  )
}

function ContextMenuItem({ icon, label, onClick, isDelete }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        background: 'transparent',
        border: 'none',
        color: isDelete ? '#ff6b6b' : '#e0e0e0',
        cursor: 'pointer',
        fontSize: 13,
        transition: 'background-color 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = isDelete ? '#3a1a1a' : '#2a2a3a'
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'transparent'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  borderRadius: 6,
  border: '1px solid #2a2a2a',
  background: '#171717',
  color: '#ddd',
  cursor: 'pointer',
  fontSize: 12,
  justifyContent: 'center',
}
