import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MOCK_PROJECTS } from '../data/mockData'

const ProjectContext = createContext(null)

const STORAGE_KEYS = {
  projects: 'codecollab_projects',
  activeProjectId: 'codecollab_activeProjectId',
  editorState: 'codecollab_editorState',
}

const DEFAULT_EDITOR_STATE = {
  theme: 'dark',
  showSidebar: true,
  showMinimap: true,
  wordWrap: true,
  showFooter: true,
  footerHeight: 190,
  beginnerMode: false,
  openTabs: [],
  activeTab: null,
  selectedFileId: null,
  cursor: { lineNumber: 1, column: 1 },
}

const safeReadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const safeWriteJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors
  }
}

const findFileById = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.type === 'folder') {
      const found = findFileById(item.children, id)
      if (found) return found
    }
  }
  return null
}

const updateTreeItem = (items, id, updater) => {
  return items.map(item => {
    if (item.id === id) return updater(item)
    if (item.type === 'folder') {
      return { ...item, children: updateTreeItem(item.children, id, updater) }
    }
    return item
  })
}

const removeTreeItem = (items, id) => {
  return items.reduce((acc, item) => {
    if (item.id === id) return acc
    if (item.type === 'folder') {
      acc.push({ ...item, children: removeTreeItem(item.children, id) })
    } else {
      acc.push(item)
    }
    return acc
  }, [])
}

const addTreeItem = (items, parentId, node) => {
  if (!parentId) {
    return [...items, node]
  }
  return items.map(item => {
    if (item.type === 'folder') {
      if (item.id === parentId) {
        return { ...item, children: [...item.children, node] }
      }
      return { ...item, children: addTreeItem(item.children, parentId, node) }
    }
    return item
  })
}

const getParentFolderId = (items, id, parentId = null) => {
  for (const item of items) {
    if (item.id === id) return parentId
    if (item.type === 'folder') {
      const found = getParentFolderId(item.children, id, item.id)
      if (found !== null) return found
    }
  }
  return null
}

const cloneNode = (item) => {
  const id = `f-${Date.now()}-${Math.random().toString(36).slice(2)}`
  if (item.type === 'folder') {
    return {
      ...item,
      id,
      children: item.children.map(cloneNode),
    }
  }
  return { ...item, id }
}

const inferLanguage = (name) => {
  const extension = name.split('.').pop().toLowerCase()
  switch (extension) {
    case 'js': return 'javascript'
    case 'jsx': return 'javascript'
    case 'ts': return 'typescript'
    case 'tsx': return 'typescript'
    case 'py': return 'python'
    case 'java': return 'java'
    case 'css': return 'css'
    case 'json': return 'json'
    case 'html': return 'html'
    case 'md': return 'markdown'
    default: return 'plaintext'
  }
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => safeReadJSON(STORAGE_KEYS.projects, MOCK_PROJECTS))
  const [activeProjectId, setActiveProjectId] = useState(() => safeReadJSON(STORAGE_KEYS.activeProjectId, null))
  const [settings, setSettings] = useState(() => safeReadJSON(STORAGE_KEYS.editorState, DEFAULT_EDITOR_STATE))
  const [openTabs, setOpenTabs] = useState(() => settings.openTabs || [])
  const [activeTab, setActiveTab] = useState(() => settings.activeTab || null)
  const [selectedFileId, setSelectedFileId] = useState(() => settings.selectedFileId || null)
  const [editorPosition, setEditorPosition] = useState(() => settings.cursor || DEFAULT_EDITOR_STATE.cursor)

  const activeProject = useMemo(
    () => projects.find(project => project.id === activeProjectId) || null,
    [projects, activeProjectId]
  )

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.projects, projects)
  }, [projects])

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.activeProjectId, activeProjectId)
  }, [activeProjectId])

  useEffect(() => {
    safeWriteJSON(STORAGE_KEYS.editorState, {
      ...settings,
      openTabs,
      activeTab,
      selectedFileId,
      cursor: editorPosition,
    })
  }, [settings, openTabs, activeTab, selectedFileId, editorPosition])

  const openProject = (projectId) => {
    if (projectId === activeProjectId) {
      setActiveProjectId(projectId)
      return
    }

    let projectExists = projects.some(project => project.id === projectId)
    if (!projectExists) {
      let newProj = null
      if (projectId === 'proj-ai') {
        newProj = {
          id: 'proj-ai',
          name: 'AI Pair Programmer Workspace',
          description: 'Workspace for AI-assisted coding and testing',
          language: 'javascript',
          members: [
            { id: 1, name: 'Yash Kumar', avatar: 'YK', role: 'owner' },
            { id: 'ai', name: 'AI Copilot', avatar: 'AI', role: 'assistant' },
          ],
          updatedAt: new Date().toISOString().split('T')[0],
          files: [
            {
              id: 'ai-f1',
              name: 'src',
              type: 'folder',
              children: [
                {
                  id: 'ai-f2',
                  name: 'main.js',
                  type: 'file',
                  language: 'javascript',
                  content: `// AI Pair Programmer Workspace\n// Select lines of code and click AI tools or ask custom questions in the panel.\n\nfunction calculateFibonacci(n) {\n  if (n <= 1) return n;\n  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);\n}\n\n// TODO: Optimize this function since it is O(2^n)\nfunction findPrimes(max) {\n  const primes = [];\n  for (let i = 2; i < max; i++) {\n    let isPrime = true;\n    for (let j = 2; j < i; j++) {\n      if (i % j == 0) {\n        isPrime = false;\n        break;\n      }\n    }\n    if (isPrime) primes.push(i);\n  }\n  return primes;\n}\n\nconsole.log("Fibonacci of 10:", calculateFibonacci(10));\nconsole.log("Primes up to 50:", findPrimes(50));\n`
                },
                {
                  id: 'ai-f3',
                  name: 'utils.js',
                  type: 'file',
                  language: 'javascript',
                  content: `export function formatBytes(bytes, decimals = 2) {\n  if (bytes === 0) return '0 Bytes';\n  const k = 1024;\n  const dm = decimals < 0 ? 0 : decimals;\n  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];\n  const i = Math.floor(Math.log(bytes) / Math.log(k));\n  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];\n}\n`
                }
              ]
            },
            {
              id: 'ai-f4',
              name: 'README.md',
              type: 'file',
              language: 'markdown',
              content: `# AI Pair Programmer Workspace\n\nWelcome to the AI Pair Programmer! Here is how to use it:\n1. Open \`src/main.js\` or \`src/utils.js\`.\n2. Highlight any line or block of code.\n3. Use the AI Assistant panel on the right:\n   - Click **Explain my code** to see how it works.\n   - Click **Detect bug** to check for standard issues (like loose equality).\n   - Click **Optimize code** to get tips on complexity.\n4. You can also chat directly with the AI in the **Custom Chat** tab!\n`
            }
          ]
        }
      } else if (projectId.startsWith('proj-collab')) {
        const roomId = projectId.replace('proj-collab-', '')
        newProj = {
          id: projectId,
          name: `Collaborative Workspace: ${roomId}`,
          description: 'Real-time collaborative room for team coding',
          language: 'javascript',
          members: [
            { id: 1, name: 'Yash Kumar', avatar: 'YK', role: 'owner' },
            { id: 2, name: 'Aisha', avatar: 'AI', role: 'editor' },
            { id: 3, name: 'Ravi', avatar: 'RA', role: 'editor' },
            { id: 4, name: 'Mira', avatar: 'MI', role: 'navigator' },
          ],
          updatedAt: new Date().toISOString().split('T')[0],
          files: [
            {
              id: 'col-f1',
              name: 'src',
              type: 'folder',
              children: [
                {
                  id: 'col-f2',
                  name: 'collab.js',
                  type: 'file',
                  language: 'javascript',
                  content: `// Collaborative Coding Workspace\n// Work together in real-time. Turn on the "Collaborator Simulator" to see live changes!\n\nfunction processData(items) {\n  console.log("Processing incoming items...");\n  return items.map(item => {\n    return {\n      ...item,\n      processed: true,\n      timestamp: Date.now()\n    };\n  });\n}\n\nconst data = [\n  { id: 1, name: "Widget A" },\n  { id: 2, name: "Widget B" }\n];\n\nconsole.log(processData(data));\n`
                }
              ]
            },
            {
              id: 'col-f3',
              name: 'README.md',
              type: 'file',
              language: 'markdown',
              content: `# Collaborative Coding Room\n\nCollaborate with your team members in real-time.\n\n- Share this room link with your teammates.\n- Use the group chat on the right panel to communicate.\n- Observe live cursors and participant activities as they work!\n- Click **Simulate Collaborators** in the right panel to see a live demonstration of real-time editing and chat updates.\n`
            }
          ]
        }
      } else if (projectId === 'proj-interview') {
        newProj = {
          id: 'proj-interview',
          name: 'Interview Coding Workspace',
          description: 'Practice coding interviews with live proctoring & test cases',
          language: 'javascript',
          members: [
            { id: 1, name: 'Yash Kumar', avatar: 'YK', role: 'candidate' }
          ],
          updatedAt: new Date().toISOString().split('T')[0],
          files: [
            {
              id: 'int-f1',
              name: 'solution.js',
              type: 'file',
              language: 'javascript',
              content: `/*\n * PROBLEM: Maximum Subarray Sum (Kadane's Algorithm)\n * \n * Given an integer array nums, find the contiguous subarray (containing at least one number)\n * which has the largest sum and return its sum.\n * \n * Example:\n * nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n * Output: 6\n * Explanation: [4, -1, 2, 1] has the largest sum = 6.\n */\n\nfunction maxSubArray(nums) {\n  // Write your Kadane's Algorithm solution here\n  let maxSoFar = nums[0];\n  let maxEndingHere = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n  \n  return maxSoFar;\n}\n`
            },
            {
              id: 'int-f2',
              name: 'README.md',
              type: 'file',
              language: 'markdown',
              content: `# Coding Interview Workspace\n\nWelcome to your live coding interview!\n\nInstructions:\n1. Read the problem statement on the left panel.\n2. Implement your solution in \`solution.js\`.\n3. Run your code using the **Run Code** or **Run Test Cases** buttons in the right panel.\n4. Monitor your remaining time with the timer at the top.\n5. Once finished, click **Submit Code** to conclude the interview.\n`
            }
          ]
        }
      }

      if (newProj) {
        setProjects(prev => [newProj, ...prev])
        projectExists = true
      }
    }

    if (!projectExists) return

    setActiveProjectId(projectId)
    setOpenTabs([])
    setActiveTab(null)
    setSelectedFileId(null)
  }

  const openFile = (file) => {
    const alreadyOpen = openTabs.some(tab => tab.id === file.id)
    if (!alreadyOpen) {
      setOpenTabs(prev => [...prev, { ...file }])
    }
    setActiveTab(file.id)

    setSelectedFileId(file.id)
  }

  const closeTab = (fileId) => {
    setOpenTabs(prev => {
      const remaining = prev.filter(tab => tab.id !== fileId)
      if (activeTab === fileId) {
        setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
      }
      return remaining
    })
    if (selectedFileId === fileId) {
      setSelectedFileId(null)
    }
  }

  const updateFileContent = (fileId, newContent) => {
    setOpenTabs(prev => prev.map(tab => tab.id === fileId ? { ...tab, content: newContent } : tab))
    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: updateTreeItem(project.files, fileId, file => ({ ...file, content: newContent })),
      }
    }))
  }

  const updateFileMeta = (fileId, patch) => {
    setOpenTabs(prev => prev.map(tab => tab.id === fileId ? { ...tab, ...patch } : tab))
    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: updateTreeItem(project.files, fileId, file => ({ ...file, ...patch })),
      }
    }))
  }

  const createFile = (name, parentFolderId = null, language = null, content = '') => {
    if (!activeProject || !name) return null

    const normalizedName = name.trim()
    const newFile = {
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: normalizedName,
      type: 'file',
      language: language || inferLanguage(normalizedName),
      content,
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: addTreeItem(project.files, parentFolderId, newFile),
      }
    }))
    return newFile
  }

  const createFolder = (name, parentFolderId = null) => {
    if (!activeProject || !name) return null

    const normalizedName = name.trim()
    const newFolder = {
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: normalizedName,
      type: 'folder',
      children: [],
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: addTreeItem(project.files, parentFolderId, newFolder),
      }
    }))
    return newFolder
  }

  const deleteFile = (fileId) => {
    if (!activeProject || !fileId) return
    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: removeTreeItem(project.files, fileId),
      }
    }))
    setOpenTabs(prev => prev.filter(tab => tab.id !== fileId))
    if (activeTab === fileId) setActiveTab(null)
    if (selectedFileId === fileId) setSelectedFileId(null)
  }

  const renameFile = (fileId, newName) => {
    if (!activeProject || !fileId || !newName) return
    const normalizedName = newName.trim()
    updateFileMeta(fileId, { name: normalizedName })
  }

  const duplicateFile = (fileId) => {
    if (!activeProject || !fileId) return null
    const source = findFileById(activeProject.files, fileId)
    if (!source || source.type !== 'file') return null

    const parentId = getParentFolderId(activeProject.files, fileId)
    const copy = {
      ...cloneNode(source),
      name: `${source.name.replace(/(\.\w+)?$/, match => ` copy${match || ''}`)}`,
    }

    setProjects(prev => prev.map(project => {
      if (project.id !== activeProjectId) return project
      return {
        ...project,
        files: addTreeItem(project.files, parentId, copy),
      }
    }))
    return copy
  }

  const createProject = (name, description, language) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name,
      description,
      language,
      members: [{ id: 1, name: 'Yash Kumar', avatar: 'YK', role: 'owner' }],
      updatedAt: new Date().toISOString().split('T')[0],
      files: [],
    }
    setProjects(prev => [newProject, ...prev])
  }

  const selectedFileData = activeProject && selectedFileId
    ? findFileById(activeProject.files, selectedFileId)
    : null

  const activeTabData = openTabs.find(tab => tab.id === activeTab) || null

  const updateEditorSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      activeProjectId,
      openTabs,
      activeTab,
      activeTabData,
      selectedFileId,
      selectedFileData,
      editorPosition,
      editorSettings: settings,
      openProject,
      openFile,
      closeTab,
      updateFileContent,
      updateFileMeta,
      createFile,
      createFolder,
      deleteFile,
      renameFile,
      duplicateFile,
      createProject,
      setActiveTab,
      setSelectedFileId,
      setEditorPosition,
      updateEditorSetting,
    }}>
      {children}
    </ProjectContext.Provider>
  )
}
export const useProject = () => useContext(ProjectContext)