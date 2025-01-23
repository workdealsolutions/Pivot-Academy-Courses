import React from "react"
import { AuthForm } from "./AuthForm"
import { BookOpen, Shield, Trophy, Users } from "lucide-react"
import "./Home.css"

export function Home() {
  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Platform",
      description: "Your data is protected with us"
    },
    {
      icon: <Trophy size={24} />,
      title: "Achievement System",
      description: "Track your learning progress"
    },
    {
      icon: <Users size={24} />,
      title: "Community Learning",
      description: "Connect with other learners"
    }
  ]

  return (
    <div className="home">
      <div className="home-container">
        <div className="greeting-section">
          <h1>Welcome to LearnHub</h1>
          <p className="intro-text">
            Your journey to excellence starts here. Join our community of learners
            and unlock your full potential with our expert-led courses.
          </p>
        </div>
        <div className="content-wrapper">
          <div className="features-container">
            <div className="features-content">
              <h2>Transform Your Learning Journey</h2>
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <div className="feature-text">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="auth-container popup">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  )
}

