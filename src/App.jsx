import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/AddEmployee";
import LeaveManagement from "./pages/LeaveManagement";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingLeaves from "./pages/PendingLeaves";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-employee"
          element={
            <ProtectedRoute>
              <Layout>
                <AddEmployee />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-management"
          element={
            <ProtectedRoute>
              <Layout>
                <LeaveManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-leaves"
          element={
            <ProtectedRoute>
              <Layout>
                <PendingLeaves />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
