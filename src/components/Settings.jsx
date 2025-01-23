import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Bell, Moon, Shield, LogOut, Book, Clock, Award, BarChart } from "lucide-react";
import { useAuth } from "../App";
import "./Settings.css";

export function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    fullName: user?.name || '',
    password: '',
    notifications: true,
    theme: 'light',
    privacy: 'public',
    privacyProfile: 'public',
    privacyActivity: 'friends',
    showEmail: false,
    twoFactorAuth: false,
    dataCollection: true
  });

  // Add new state for tracking progress
  const [progressStats, setProgressStats] = useState({
    activeCourses: 0,
    completionRate: 0,
    learningHours: 0,
    achievements: 0
  });

  // Simulate fetching user progress data
  useEffect(() => {
    // This would typically be an API call to get user's progress
    const fetchUserProgress = () => {
      // Example data - replace with actual API call
      return {
        activeCourses: user?.courses?.length || 3,
        completionRate: calculateCompletionRate(user?.courses) || 65,
        learningHours: calculateLearningHours(user?.courses) || 24,
        achievements: user?.achievements?.length || 8
      };
    };

    setProgressStats(fetchUserProgress());
  }, [user]);

  // Helper functions to calculate statistics
  const calculateCompletionRate = (courses) => {
    if (!courses) return 0;
    const completed = courses.filter(course => course.progress === 100).length;
    return Math.round((completed / courses.length) * 100);
  };

  const calculateLearningHours = (courses) => {
    if (!courses) return 0;
    return courses.reduce((total, course) => total + (course.timeSpent || 0), 0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  // Add progress stats section to the component
  const statsCards = [
    {
      icon: Book,
      title: "Active Courses",
      value: progressStats.activeCourses,
      trend: "+2 this month"
    },
    {
      icon: BarChart,
      title: "Completion Rate",
      value: `${progressStats.completionRate}%`,
      trend: "+5% from last month"
    },
    {
      icon: Clock,
      title: "Learning Hours",
      value: progressStats.learningHours,
      trend: "+3.5 hrs this week"
    },
    {
      icon: Award,
      title: "Achievements",
      value: progressStats.achievements,
      trend: "2 new unlocked"
    }
  ];

  return (
    <motion.div 
      className="settings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="stats-overview">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-panel">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="settings-form"
              >
                <div className="form-section">
                  <h2>Profile Information</h2>
                  <div className="input-group">
                    <label>
                      <User size={20} />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <Mail size={20} />
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <Lock size={20} />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Change password"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="logout-button"
                    onClick={logout}
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.form>
            )}

            {activeTab === 'privacy' && (
              <motion.form
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="settings-form"
              >
                <div className="form-section">
                  <h2>Privacy Settings</h2>
                  
                  <div className="setting-group">
                    <div className="setting-header">
                      <h3>Profile Visibility</h3>
                      <p>Control who can see your profile information</p>
                    </div>
                    <div className="setting-options">
                      <select
                        name="privacyProfile"
                        value={formData.privacyProfile}
                        onChange={handleChange}
                        className="select-control"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-group">
                    <div className="setting-header">
                      <h3>Email Visibility</h3>
                      <p>Show your email address on your profile</p>
                    </div>
                    <div className="setting-options">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="showEmail"
                          checked={formData.showEmail}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="setting-group">
                    <div className="setting-header">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <div className="setting-options">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={formData.twoFactorAuth}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="setting-group">
                    <div className="setting-header">
                      <h3>Activity Status</h3>
                      <p>Control who can see your online status</p>
                    </div>
                    <div className="setting-options">
                      <select
                        name="privacyActivity"
                        value={formData.privacyActivity}
                        onChange={handleChange}
                        className="select-control"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="friends">Friends Only</option>
                        <option value="none">No One</option>
                      </select>
                    </div>
                  </div>

                  <div className="setting-group">
                    <div className="setting-header">
                      <h3>Data Collection</h3>
                      <p>Allow us to collect usage data to improve your experience</p>
                    </div>
                    <div className="setting-options">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          name="dataCollection"
                          checked={formData.dataCollection}
                          onChange={handleChange}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Save Privacy Settings
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
