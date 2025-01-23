import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AuthForm from "../components/AuthForm"
import Feature from "../components/Feature"

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])

  return (
    <div className="home">
      <div className="home-content">
        <div className="auth-form-container">
          <AuthForm />
        </div>
        <div className="features-container">
          <div className="features-content">
            <h2>Unlock Your Potential</h2>
            <div className="features-list">
              <Feature
                icon="BookMarked"
                title="Expert-Led Courses"
                description="Learn from industry experts and gain practical skills"
              />
              <Feature
                icon="Target"
                title="Self-Paced Learning"
                description="Study at your own pace with lifetime access"
              />
              <Feature
                icon="AlignCenterVertical"
                title="Earn Certificates"
                description="Get recognized for your achievements"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

