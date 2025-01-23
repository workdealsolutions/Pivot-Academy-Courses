import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import CoursesPage from "../components/CoursesPage"
import "./Courses.css"
export default function Courses() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="courses-page">
      <main className="courses-content">
        <CoursesPage />
      </main>
    </div>
  )
}

