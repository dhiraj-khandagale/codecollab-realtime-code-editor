import { createContext, useContext, useState } from 'react'
import { MOCK_PROJECTS } from '../data/mockData'

const ProjectContext = createContext(null)

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [activeProject, setActiveProject] = useState(null)
  const [openTabs, setOpenTabs] = useState([])      // files open in editor
  const [activeTab, setActiveTab] = useState(null)  // currently focused tab

  const openProject = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    setActiveProject(project)
    setOpenTabs([])
    setActiveTab(null)
  }

  const openFile = (file) => {
    const alreadyOpen = openTabs.find(t => t.id === file.id)
    if (!alreadyOpen) {
      setOpenTabs(prev => [...prev, { ...file }])
    }
    setActiveTab(file.id)
  }

  const closeTab = (fileId) => {
    const remaining = openTabs.filter(t => t.id !== fileId)
    setOpenTabs(remaining)
    if (activeTab === fileId) {
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
    }
  }

  const updateFileContent = (fileId, newContent) => {
    setOpenTabs(prev =>
      prev.map(t => t.id === fileId ? { ...t, content: newContent } : t)
    )
  }

  const createProject = (name, description, language) => {
    const newProject = {
      id: `proj-${Date.now()}`,
      name, description, language,
      members: [{ id: 1, name: "Yash Kumar", avatar: "YK", role: "owner" }],
      updatedAt: new Date().toISOString().split('T')[0],
      files: []
    }
    setProjects(prev => [newProject, ...prev])
  }

  const activeTabData = openTabs.find(t => t.id === activeTab) || null

  return (
    <ProjectContext.Provider value={{
      projects, activeProject, openTabs, activeTab, activeTabData,
      openProject, openFile, closeTab, updateFileContent, createProject
    }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)