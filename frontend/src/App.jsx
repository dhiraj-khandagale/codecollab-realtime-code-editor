import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import ProtectedRoute from './routes/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectPage from './pages/ProjectPage'
import AIProgrammerPage from './pages/AIProgrammerPage'
import CollaborationPage from './pages/CollaborationPage'
import InterviewModePage from './pages/InterviewModePage'

export default function App() {
return ( <AuthProvider> <ProjectProvider> <BrowserRouter> <Toaster position="top-right" /> <Routes>
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />

```
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-programmer"
          element={
            <ProtectedRoute>
              <AIProgrammerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/collaborate/:roomId?"
          element={
            <ProtectedRoute>
              <CollaborationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewModePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </ProjectProvider>
</AuthProvider>

)
}
