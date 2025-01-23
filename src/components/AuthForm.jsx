import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"
import { useAuth } from "../App"
import "./AuthForm.css"

export function AuthForm() {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading] = useState(false)
  const [error] = useState(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    login()
    navigate('/courses')
  }

  return (
    <div className="auth-form">
      <h2>{mode === "signin" ? "Sign In" : "Create Account"}</h2>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="mode-switch">
        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mode-switch-button">
          {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  )
}

