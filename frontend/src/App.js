import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Splash Screen
import SplashScreen from "./pages/SplashScreen";

// Auth
import AuthPage from "./pages/AuthPage";

// Student
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentEvents from "./pages/StudentEvents";
import StudentNetwork from "./pages/StudentNetwork";
import StudentJobs from "./pages/StudentJobs";
import StudentAchievements from "./pages/StudentAchievements";
import Navbar from "./components/Navbar";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminProfile from "./pages/AdminProfile";
import AdminViewEvents from "./pages/ViewEvents";
import AdminNavbar from "./components/AdminNavbar";

// Alumni
import AlumniDashboard from "./pages/AlumniDashboard";
import AlumniProfile from "./pages/AlumniProfile";
import AlumniJobs from "./pages/AlumniJobs";
import AlumniViewJobs from "./pages/AlumniViewJobs";
import AlumniConnections from "./pages/AlumniConnections"; // ✅ ADDED
import AlumniNavbar from "./components/AlumniNavbar";

function AppWrapper() {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [location.pathname]);

  // ✅ Protected Route for Role-based Access
  const ProtectedRoute = ({ children, requiredRole }) => {
    if (role && !role.includes(requiredRole)) {
      // redirect safely depending on role
      if (role.includes("ADMIN")) return <Navigate to="/admin/dashboard" replace />;
      if (role.includes("STUDENT")) return <Navigate to="/student/dashboard" replace />;
      if (role.includes("ALUMNI")) return <Navigate to="/alumni/dashboard" replace />;
      return <Navigate to="/auth" replace />;
    }
    return children;
  };

  const hideNavbarRoutes = ["/", "/auth", "/login", "/register"];

  return (
    <>
      {/* ✅ Dynamic Navbar Display */}
      {!hideNavbarRoutes.includes(location.pathname) && role?.includes("STUDENT") && <Navbar />}
      {!hideNavbarRoutes.includes(location.pathname) && role?.includes("ADMIN") && <AdminNavbar />}
      {!hideNavbarRoutes.includes(location.pathname) && role?.includes("ALUMNI") && <AlumniNavbar />}

      <Routes>
        {/* -------------------- SPLASH SCREEN -------------------- */}
        <Route path="/" element={<SplashScreen />} />

        {/* -------------------- AUTH -------------------- */}
        <Route path="/auth" element={<AuthPage />} />

        {/* -------------------- STUDENT ROUTES -------------------- */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/network"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentNetwork />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/achievements"
          element={
            <ProtectedRoute requiredRole="STUDENT">
              <StudentAchievements />
            </ProtectedRoute>
          }
        />

        {/* -------------------- ADMIN ROUTES -------------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-events"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminViewEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        {/* -------------------- ALUMNI ROUTES -------------------- */}
        <Route
          path="/alumni/dashboard"
          element={
            <ProtectedRoute requiredRole="ALUMNI">
              <AlumniDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/profile"
          element={
            <ProtectedRoute requiredRole="ALUMNI">
              <AlumniProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/jobs"
          element={
            <ProtectedRoute requiredRole="ALUMNI">
              <AlumniJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/view-jobs"
          element={
            <ProtectedRoute requiredRole="ALUMNI">
              <AlumniViewJobs />
            </ProtectedRoute>
          }
        />
        {/* ✅ ADDED Alumni Connections Route */}
        <Route
          path="/alumni/connections"
          element={
            <ProtectedRoute requiredRole="ALUMNI">
              <AlumniConnections />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
