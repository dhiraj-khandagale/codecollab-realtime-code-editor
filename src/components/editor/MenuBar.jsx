import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../../context/ProjectContext'
import {
  FileText, FilePlus, FolderPlus, Save, X, Files,
  Undo2, Redo2, Scissors, Copy, ClipboardPaste, Search, Replace,
  MousePointer2, ArrowUpDown, ChevronsUpDown,
  PanelLeft, Terminal as TermIcon, Columns2, Maximize2,
  ArrowRight, ArrowLeft, CornerDownRight,
  Play, Bug, Square, RotateCcw, Circle,
  SquareTerminal, SplitSquareHorizontal, ListChecks,
  HelpCircle, BookOpen, Keyboard, Info, Sparkles,
  Edit3, Trash2, Sun, Moon
} from 'lucide-react'
import toast from 'react-hot-toast'
import './MenuBar.css'

/* ────────────────────────────────────────────
   Menu definitions
   ──────────────────────────────────────────── */

const MENUS = [
  {
    label: 'File',
    items: [
      { label: 'New File',      icon: FilePlus,        shortcut: 'Ctrl+N',        action: 'newFile'       },
      { label: 'New Folder',    icon: FolderPlus,      shortcut: 'Ctrl+Shift+N',  action: 'newFolder'     },
      { label: 'Duplicate',     icon: Copy,            shortcut: 'Ctrl+D',        action: 'duplicateFile' },
      { label: 'Rename',        icon: Edit3,           shortcut: 'F2',            action: 'renameFile'    },
      { label: 'Delete',        icon: Trash2,          shortcut: 'Del',           action: 'deleteFile'    },
      'sep',
      { label: 'Save',          icon: Save,            shortcut: 'Ctrl+S',        action: 'save'          },
      { label: 'Save All',      icon: Save,            shortcut: 'Ctrl+K S',      action: 'saveAll'       },
      'sep',
      { label: 'Close Editor',  icon: X,               shortcut: 'Ctrl+W',        action: 'closeTab'      },
      { label: 'Close All',     icon: X,               shortcut: 'Ctrl+K Ctrl+W', action: 'closeAll'      },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo',          icon: Undo2,           shortcut: 'Ctrl+Z',       action: 'undo'          },
      { label: 'Redo',          icon: Redo2,           shortcut: 'Ctrl+Y',       action: 'redo'          },
      'sep',
      { label: 'Cut',           icon: Scissors,        shortcut: 'Ctrl+X'                          },
      { label: 'Copy',          icon: Copy,            shortcut: 'Ctrl+C'                          },
      { label: 'Paste',         icon: ClipboardPaste,  shortcut: 'Ctrl+V'                          },
      'sep',
      { label: 'Find',          icon: Search,          shortcut: 'Ctrl+F',       action: 'find'          },
      { label: 'Replace',       icon: Replace,         shortcut: 'Ctrl+H',       action: 'replace'       },
      { label: 'Find in Files', icon: Search,          shortcut: 'Ctrl+Shift+F'                     },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Command Palette',  icon: Sparkles,        shortcut: 'Ctrl+Shift+P', action: 'commandPalette' },
      'sep',
      { label: 'Explorer',         icon: Files,           shortcut: 'Ctrl+Shift+E'                    },
      { label: 'Search',           icon: Search,          shortcut: 'Ctrl+Shift+F'                    },
      'sep',
      { label: 'Toggle Sidebar',   icon: PanelLeft,       shortcut: 'Ctrl+B',        action: 'toggleSidebar'  },
      { label: 'Toggle Minimap',   icon: Columns2,        shortcut: 'Alt+M',         action: 'toggleMinimap'  },
      { label: 'Word Wrap',        icon: CornerDownRight, shortcut: 'Alt+Z',         action: 'toggleWordWrap' },
      'sep',
      { label: 'Toggle Theme',     icon: Sun,             shortcut: 'Ctrl+K T',      action: 'toggleTheme'    },
      { label: 'Zoom In',          icon: Maximize2,       shortcut: 'Ctrl+=',                           },
      { label: 'Zoom Out',         icon: Maximize2,       shortcut: 'Ctrl+-',                           },
    ],
  },
  {
    label: 'Go',
    items: [
      { label: 'Go to File',        icon: FileText,        shortcut: 'Ctrl+P'          },
      { label: 'Go to Line',        icon: CornerDownRight, shortcut: 'Ctrl+G', action: 'goToLine' },
      { label: 'Go to Symbol',      icon: Sparkles,        shortcut: 'Ctrl+Shift+O'    },
      'sep',
      { label: 'Go to Definition',  icon: ArrowRight,      shortcut: 'F12'             },
      { label: 'Go Back',           icon: ArrowLeft,       shortcut: 'Alt+←'           },
      { label: 'Go Forward',        icon: ArrowRight,      shortcut: 'Alt+→'           },
    ],
  },
  {
    label: 'Run',
    items: [
      { label: 'Start Debugging',        icon: Bug,          shortcut: 'F5'              },
      { label: 'Run Without Debugging',   icon: Play,         shortcut: 'Ctrl+F5'        },
      'sep',
      { label: 'Stop',                    icon: Square,       shortcut: 'Shift+F5'       },
      { label: 'Restart',                 icon: RotateCcw,    shortcut: 'Ctrl+Shift+F5'  },
      'sep',
      { label: 'Toggle Breakpoint',       icon: Circle,       shortcut: 'F9'             },
    ],
  },
  {
    label: 'Terminal',
    items: [
      { label: 'New Terminal',     icon: SquareTerminal,          shortcut: 'Ctrl+`',        action: 'newTerminal'      },
      { label: 'Split Terminal',   icon: SplitSquareHorizontal,   shortcut: 'Ctrl+Shift+`'                           },
      'sep',
      { label: 'Run Task...',     icon: ListChecks,              shortcut: ''                                         },
      { label: 'Run Build Task',  icon: Play,                    shortcut: 'Ctrl+Shift+B'                           },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Welcome',              icon: Sparkles,    shortcut: ''             },
      { label: 'Documentation',        icon: BookOpen,    shortcut: ''             },
      { label: 'Keyboard Shortcuts',   icon: Keyboard,    shortcut: 'Ctrl+K Ctrl+S' },
      'sep',
      { label: 'About',                icon: Info,        shortcut: ''             },
    ],
  },
]

export default function MenuBar({ editorRef, onToggleSidebar, onToggleMinimap, onToggleWordWrap, onToggleTheme }) {
  const [openMenu, setOpenMenu] = useState(null)
  const [hoverMode, setHoverMode] = useState(false)
  const barRef = useRef(null)
  const navigate = useNavigate()

  const handleClose = useCallback(() => {
    setOpenMenu(null)
    setHoverMode(false)
  }, [])

  const handleMenuClick = (idx) => {
    if (openMenu === idx) {
      handleClose()
    } else {
      setOpenMenu(idx)
      setHoverMode(true)
    }
  }

  const handleMenuHover = (idx) => {
    if (hoverMode && openMenu !== null) {
      setOpenMenu(idx)
    }
  }

  const {
    activeTabData,
    activeTab,
    closeTab,
    openTabs,
    selectedFileData,
    selectedFileId,
    createFile,
    createFolder,
    deleteFile,
    renameFile,
    duplicateFile,
  } = useProject()

  const performEditorAction = useCallback((action) => {
    const editor = editorRef?.current

    switch (action) {
      case 'save':
        toast.success('Saved! (mock — no backend yet)')
        return
      case 'saveAll':
        toast.success('All files saved! (mock)')
        return
      case 'closeTab':
        if (activeTab) closeTab(activeTab)
        return
      case 'closeAll':
        openTabs.forEach(tab => closeTab(tab.id))
        return
      case 'undo':
        editor?.trigger('menu', 'undo')
        return
      case 'redo':
        editor?.trigger('menu', 'redo')
        return
      case 'find':
        editor?.trigger('menu', 'actions.find')
        return
      case 'replace':
        editor?.trigger('menu', 'editor.action.startFindReplaceAction')
        return
      case 'goToLine':
        editor?.trigger('menu', 'editor.action.gotoLine')
        return
      case 'commandPalette':
        editor?.trigger('menu', 'editor.action.quickCommand')
        return
      case 'toggleSidebar':
        onToggleSidebar?.()
        return
      case 'toggleMinimap':
        onToggleMinimap?.()
        return
      case 'toggleWordWrap':
        onToggleWordWrap?.()
        return
      case 'toggleTheme':
        onToggleTheme?.()
        return
      case 'newTerminal':
        toast('Terminal panel coming soon!', { icon: '🖥️' })
        return
      case 'newFile': {
        const fileName = window.prompt('New file name', 'untitled.js')
        if (fileName) {
          const parentId = selectedFileData?.type === 'folder' ? selectedFileData.id : null
          createFile(fileName, parentId)
          toast.success(`Created ${fileName}`)
        }
        return
      }
      case 'newFolder': {
        const folderName = window.prompt('New folder name', 'new-folder')
        if (folderName) {
          const parentId = selectedFileData?.type === 'folder' ? selectedFileData.id : null
          createFolder(folderName, parentId)
          toast.success(`Created ${folderName}`)
        }
        return
      }
      case 'renameFile': {
        if (!selectedFileId) {
          toast.error('Select a file or folder first')
          return
        }
        const newName = window.prompt('Rename item', selectedFileData?.name || '')
        if (newName) {
          renameFile(selectedFileId, newName)
          toast.success('Renamed item')
        }
        return
      }
      case 'deleteFile': {
        if (!selectedFileId) {
          toast.error('Select an item to delete')
          return
        }
        if (window.confirm('Delete selected item permanently?')) {
          deleteFile(selectedFileId)
          toast.success('Deleted item')
        }
        return
      }
      case 'duplicateFile': {
        if (!selectedFileId) {
          toast.error('Select a file to duplicate')
          return
        }
        duplicateFile(selectedFileId)
        toast.success('Duplicated file')
        return
      }
      default:
        toast(`"${action}" — coming soon!`, { icon: '🚧' })
    }
  }, [activeTab, closeTab, createFile, createFolder, deleteFile, duplicateFile, editorRef, onToggleMinimap, onToggleSidebar, onToggleTheme, openTabs, renameFile, selectedFileData, selectedFileId])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat) return
      const metaKey = event.ctrlKey || event.metaKey
      if (metaKey) {
        switch (true) {
          case event.key.toLowerCase() === 's':
            event.preventDefault()
            performEditorAction('save')
            break
          case event.key.toLowerCase() === 'b':
            event.preventDefault()
            performEditorAction('toggleSidebar')
            break
          case event.key.toLowerCase() === 'z' && !event.shiftKey:
            event.preventDefault()
            performEditorAction('undo')
            break
          case event.key.toLowerCase() === 'y':
            event.preventDefault()
            performEditorAction('redo')
            break
          case event.key.toLowerCase() === 'f':
            event.preventDefault()
            performEditorAction('find')
            break
          case event.key.toLowerCase() === 'h':
            event.preventDefault()
            performEditorAction('replace')
            break
          case event.key.toLowerCase() === 'g':
            event.preventDefault()
            performEditorAction('goToLine')
            break
          case event.key.toLowerCase() === 'k' && event.shiftKey:
            event.preventDefault()
            performEditorAction('commandPalette')
            break
          case event.key.toLowerCase() === 't' && event.shiftKey:
            event.preventDefault()
            performEditorAction('toggleTheme')
            break
          default:
            break
        }
      } else if (event.altKey && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        performEditorAction('toggleWordWrap')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [performEditorAction])

  return (
    <>
      {openMenu !== null && <div className="menubar-backdrop" onClick={handleClose} />}
      <div className="menubar" ref={barRef}>
        {MENUS.map((menu, idx) => (
          <div
            key={menu.label}
            className={`menubar-item${openMenu === idx ? ' active' : ''}`}
            onClick={() => handleMenuClick(idx)}
            onMouseEnter={() => handleMenuHover(idx)}
          >
            {menu.label}
            {openMenu === idx && (
              <div className="menubar-dropdown">
                {menu.items.map((item, i) =>
                  item === 'sep' ? (
                    <div key={`sep-${i}`} className="menu-separator" />
                  ) : (
                    <div
                      key={item.label}
                      className="menu-row"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (item.action) {
                          performEditorAction(item.action)
                          handleClose()
                        } else {
                          handleClose()
                          toast(`"${item.label}" — coming soon!`, { icon: '🚧' })
                        }
                      }}
                    >
                      <span className="menu-row-label">
                        <span className="menu-row-icon">
                          {item.icon && <item.icon size={14} />}
                        </span>
                        {item.label}
                      </span>
                      {item.shortcut && (
                        <span className="menu-row-shortcut">{item.shortcut}</span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
