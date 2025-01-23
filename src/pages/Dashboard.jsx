import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import Dashboard from "../components/Dashboard"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-content">
        <Dashboard />
      </main>
    </div>
  )
}

