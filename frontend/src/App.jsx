import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyPosts from "./pages/MyPosts";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import CreateExperience from "./pages/CreateExperience";
import Resources from "./pages/Resources";
import ExperienceDetails from "./pages/ExperienceDetails";
import AdminExperienceDetails from "./pages/AdminExperienceDetails";
import Layout from "./components/Layout";

// RequireAuth component for student routes
const RequireAuth = () => {
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1])); // decode JWT
    } catch {}
  }

  if (!token) return <Navigate to="/login" replace />;        // not logged in
  if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />; // admin cannot access student routes

  return <Outlet />; // render child routes
};

// RequireAdmin component for admin routes
const RequireAdmin = () => {
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1]));
    } catch {}
  }

  if (!token || user?.role !== "admin") return <Navigate to="/login" replace />; // not admin
  return <Outlet />; // render child routes
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes — wrapped in Layout */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateExperience />} />
            <Route path="/experience/:id" element={<ExperienceDetails />} />
            <Route path="/dashboard/myposts" element={<MyPosts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin Routes — wrapped in Layout */}
        <Route element={<RequireAdmin />}>
          <Route element={<Layout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/experience/:id" element={<AdminExperienceDetails />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;