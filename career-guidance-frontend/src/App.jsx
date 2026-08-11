import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage        from "./pages/LandingPage";
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import DashboardPage      from "./pages/DashboardPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import SkillAnalysisPage  from "./pages/SkillAnalysisPage";
import MockInterviewPage  from "./pages/MockInterviewPage";
import RoadmapPage        from "./pages/RoadmapPage";
import JobMatchPage       from "./pages/JobMatchPage";
import RoadmapDetailsPage from "./pages/RoadmapDetailsPage";
import RoadmapResultPage from "./pages/RoadmapResultPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/resume"
          element={
            <ProtectedRoute>
              <ResumeAnalysisPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/skills"
          element={
            <ProtectedRoute>
              <SkillAnalysisPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/interview"
          element={
            <ProtectedRoute>
              <MockInterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/roadmap"
          element={
            <ProtectedRoute>
              <RoadmapPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute>
              <JobMatchPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/dashboard/roadmap/details" element={<ProtectedRoute><RoadmapDetailsPage /></ProtectedRoute>} />
        <Route path="/dashboard/roadmap/result" element={<ProtectedRoute><RoadmapResultPage /></ProtectedRoute>} />

      </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  );
}

export default App;