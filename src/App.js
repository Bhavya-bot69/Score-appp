import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppProvider, useApp } from "./context/AppContext";
import LandingPage from "./pages/LandingPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FeaturesPage from "./pages/FeaturesPage";
import AlgorithmPage from "./pages/AlgorithmPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManager from "./pages/CategoryManager";
import JudgeInterface from "./pages/JudgeInterface";
import ResultsPage from "./pages/ResultsPage";
import EventList from "./pages/EventList";
import ManageEvent from "./pages/ManageEvent";
import JudgeDashboard from "./pages/JudgeDashboard";
import AdminResults from "./pages/AdminResults";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const { user } = useApp();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/algorithm" element={<AlgorithmPage />} />

        {/* Auth routes → redirect if already logged in */}
        <Route
          path="/login"
          element={user ? <Navigate to="/admin/events" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/admin/events" /> : <Register />}
        />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin" user={user}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <PrivateRoute role="admin" user={user}>
              <EventList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/event/:eventId"
          element={
            <PrivateRoute role="admin" user={user}>
              <ManageEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/event/:eventId/results"
          element={
            <PrivateRoute role="admin" user={user}>
              <AdminResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute role="admin" user={user}>
              <CategoryManager />
            </PrivateRoute>
          }
        />

        <Route path="/judge-dashboard" element={<JudgeDashboard />} />

        {/* Judge-only route */}
        <Route
          path="/judge"
          element={
            <PrivateRoute role="judge" user={user}>
              <JudgeInterface />
            </PrivateRoute>
          }
        />

        {/* Any logged-in user */}
        <Route
          path="/results"
          element={
            <PrivateRoute user={user}>
              <ResultsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
