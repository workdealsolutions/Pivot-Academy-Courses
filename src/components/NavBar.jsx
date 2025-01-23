import React, { useState } from "react"
import { NotificationCenter } from "./NotificationCenter"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Layout, Settings, LogOut, Bell, Home } from "lucide-react"
import { useAuth } from "../App"
import './NavBar.css'


export function NavBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const location = useLocation();

  const handleSignOut = () => {
    logout()
    navigate("/")
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src="/motif.png" alt="PIVOT Academy" className="logo-icon" />
          <span className="logo-text">PIVOT Academy</span>
        </div>

        {user && (
          <div className="navbar-links">
            <NavButton to="/" icon={Home} label="Home" isActive={location.pathname === '/'} />
            <NavButton 
              to="/dashboard" 
              icon={Layout} 
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
            <NavButton 
              to="/settings" 
              icon={Settings} 
              label="Settings" 
              isActive={location.pathname === '/settings'} 
            />
            <button 
              onClick={toggleNotifications} 
              className={`nav-button ${showNotifications ? 'active' : ''}`}
            >
              <Bell />
              <span>Notifications</span>
            </button>
            <NavButton onClick={handleSignOut} icon={LogOut} label="Sign Out" />
          </div>
        )}
      </div>
      {showNotifications && (
        <div className="notification-popup">
          <NotificationCenter />
        </div>
      )}
    </nav>
  )
}

function NavButton({ to, icon: Icon, label, onClick, isActive }) {
  if (onClick) {
    return (
      <button onClick={onClick} className="nav-button">
        <Icon />
        <span>{label}</span>
      </button>
    )
  }
  return (
    <Link to={to} className={`nav-button ${isActive ? 'active' : ''}`}>
      <Icon />
      <span>{label}</span>
    </Link>
  )
}
