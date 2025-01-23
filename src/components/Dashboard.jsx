import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { BookOpen, Clock, Target, Zap, Trophy } from "lucide-react";
import { useAuth } from "../App";
import { SAMPLE_COURSES } from '../data/sampleData';
import { COURSE_MODULES } from '../data/courseModules';  // Add this import
import "./Dashboard.css";

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completedCourses: 5, totalHours: 120 });
  const [currentCourses, setCurrentCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stats data from an API
    // const fetchedStats = await fetchStatsFromAPI();
    // setStats(fetchedStats);
  }, []);

  // Repeat similar useEffect hooks for other state variables if needed

  useEffect(() => {
    // Fetch data and update state variables
    setLoading(false);
  }, []);

  useEffect(() => {
    const inProgressCourses = JSON.parse(localStorage.getItem('inProgressCourses') || '[]');
    // Merge the progress data with the full course details
    const coursesWithDetails = inProgressCourses.map(progressCourse => {
      const fullCourse = SAMPLE_COURSES.find(c => c.id === progressCourse.id);
      return {
        ...fullCourse,
        progress: progressCourse.progress,
        lastAccessed: progressCourse.lastAccessed
      };
    });
    setCurrentCourses(coursesWithDetails);
  }, []);

  const resumeCourse = (courseId) => {
    // Get the course modules
    const courseModules = COURSE_MODULES[courseId];
    if (courseModules && courseModules.length > 0) {
      // Navigate to first module, first lesson
      const firstModule = courseModules[0];
      const firstLesson = firstModule.lessons[0];
      navigate(`/courses/${courseId}/learn/${firstModule.id}/${firstLesson.id}`);
    }
  };

  const toggleShowAllCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  const renderCourseList = () => {
    const coursesToShow = showAllCourses ? currentCourses : currentCourses.slice(0, 1);
    
    return (
      <div className="course-list">
        {coursesToShow.map((course) => (
          <motion.div 
            key={course.id} 
            className="course-item"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="course-header">
              <img src={course.image_url} alt={course.title} />
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.instructor}</p>
              </div>
            </div>

            <div className="course-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="progress-text">{course.progress}% Complete</span>
            </div>

            <button 
              className="resume-button"
              onClick={() => resumeCourse(course.id)}
            >
              Resume Course
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  const calculateUserStats = useCallback(() => {
    const inProgressCourses = currentCourses;
    
    // Calculate active courses
    const activeCourses = inProgressCourses.length;

    // Calculate completion rate
    const totalProgress = inProgressCourses.reduce((sum, course) => sum + (course.progress || 0), 0);
    const completionRate = activeCourses ? Math.round(totalProgress / activeCourses) : 0;

    // Calculate learning hours (assuming 1% progress = 0.3 hours)
    const totalHours = inProgressCourses.reduce((sum, course) => {
      const courseHours = Math.round((course.progress * 0.3) * 10) / 10;
      return sum + courseHours;
    }, 0);

    // Calculate achievements
    const achievements = inProgressCourses.reduce((count, course) => {
      // Count milestones as achievements (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      const courseAchievements = milestones.filter(milestone => course.progress >= milestone).length;
      return count + courseAchievements;
    }, 0);

    return {
      activeCourses,
      completionRate,
      totalHours,
      achievements
    };
  }, [currentCourses]);

  // Add new function to calculate weekly activity
  const calculateWeeklyActivity = useCallback(() => {
    const today = new Date();
    const weeklyData = [];
    let totalHours = 0;

    // Get progress updates from the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Calculate hours spent for this day based on course progress
      const dayProgress = currentCourses.reduce((total, course) => {
        const progressOnDate = course.lastAccessed?.startsWith(dateStr) 
          ? (course.progress || 0) * 0.3 // Convert progress to hours (30 mins per 1%)
          : 0;
        return total + progressOnDate;
      }, 0);

      totalHours += dayProgress;
      weeklyData.push({
        day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()],
        hours: Math.round(dayProgress * 10) / 10,
        date: dateStr
      });
    }

    setWeeklyActivity(weeklyData);
    return totalHours;
  }, [currentCourses]);

  // Update stats when courses change
  useEffect(() => {
    const userStats = calculateUserStats();
    setStats(prevStats => ({
      ...prevStats,
      ...userStats
    }));
  }, [calculateUserStats]);

  // Update useEffect for course data
  useEffect(() => {
    const totalHours = calculateWeeklyActivity();
    setStats(prev => ({
      ...prev,
      weeklyHours: Math.round(totalHours * 10) / 10
    }));
  }, [calculateWeeklyActivity]);

  // Replace the weekly activity section in the render method
  const renderWeeklyActivity = () => (
    <div className="weekly-activity">
      <div className="activity-header">
        <h3>Weekly Activity</h3>
        <span className="hours-total">
          {stats.weeklyHours || 0} hours this week
        </span>
      </div>
      <div className="activity-graph">
        {weeklyActivity.map((day, index) => (
          <div key={index} className="activity-bar">
            <div 
              className="bar-fill" 
              style={{ 
                height: `${(day.hours / 8) * 100}%`, // Assuming 8 hours is 100%
                opacity: day.hours > 0 ? 1 : 0.2
              }}
            />
            <span className="day-label">{day.day}</span>
            {day.hours > 0 && (
              <span className="hours-label">
                {day.hours}h
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Modify the StatCard displays
  const getStatTrend = (stat) => {
    switch(stat) {
      case 'activeCourses':
        return currentCourses.length ? `${currentCourses.length} in progress` : 'No active courses';
      case 'completionRate':
        const recentProgress = currentCourses[0]?.progress || 0;
        return `Last progress: ${recentProgress}%`;
      case 'totalHours':
        const weeklyHours = stats.totalHours / 4; // Simplified weekly calculation
        return `~${weeklyHours.toFixed(1)}hrs this week`;
      case 'achievements':
        const recentAchievements = currentCourses.filter(c => c.progress >= 25).length;
        return `${recentAchievements} new`;
      default:
        return '';
    }
  };

  const getCompletedCourses = () => {
    return currentCourses.filter(course => course.progress === 100)
      .map(course => ({
        id: course.id,
        title: course.title,
        completedDate: course.lastAccessed,
        type: 'course',
        icon: Trophy
      }));
  };

  const renderAchievements = () => {
    const completedCourses = getCompletedCourses();

    if (completedCourses.length === 0) {
      return (
        <div className="no-achievements">
          <Trophy size={32} />
          <p>Complete your first course to earn achievements!</p>
        </div>
      );
    }

    return (
      <div className="achievements-list">
        {completedCourses.map((achievement) => (
          <motion.div 
            key={achievement.id}
            className="achievement-item"
            whileHover={{ scale: 1.02 }}
          >
            <div className="achievement-icon">
              <achievement.icon size={20} />
            </div>
            <div className="achievement-info">
              <h4>Course Completed</h4>
              <p>{achievement.title}</p>
              <span className="completion-date">
                {new Date(achievement.completedDate).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="welcome-section">
        <motion.div 
          className="welcome-content"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Welcome back, {user?.name}!</h1>
          <p className="welcome-subtitle">Ready to continue your learning journey?</p>
          <div className="welcome-stats">
            <motion.div 
              className="streak-badge"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="streak-icon" />
              <span className="streak-text">{stats.streak} Day Streak!</span>
            </motion.div>
          </div>
          <div className="quick-actions">
            <button className="action-button">Resume Learning</button>
            <button className="action-button">Browse Courses</button>
          </div>
          <div className="streak-days">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`streak-day ${i < 5 ? 'completed' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.div 
        className="stats-grid"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <StatCard 
          icon={BookOpen} 
          title="Active Courses" 
          value={stats.activeCourses} 
          trend={getStatTrend('activeCourses')}
        />
        <StatCard 
          icon={Target} 
          title="Completion Rate" 
          value={`${stats.completionRate}%`}
          trend={getStatTrend('completionRate')} 
        />
        <StatCard 
          icon={Clock} 
          title="Learning Hours" 
          value={`${stats.totalHours}`}
          trend={getStatTrend('totalHours')} 
        />
        <StatCard 
          icon={Trophy} 
          title="Achievements" 
          value={stats.achievements}
          trend={getStatTrend('achievements')} 
        />
      </motion.div>

      <div className="main-content-wrapper">
        <div className="dashboard-content">
          <motion.div 
            className="courses-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="active-courses">
              <header className="section-header">
                <h2>Current Courses</h2>
                {currentCourses.length > 1 && (
                  <button 
                    className="view-all"
                    onClick={toggleShowAllCourses}
                  >
                    {showAllCourses ? 'Show Less' : 'View All'}
                  </button>
                )}
              </header>
              {renderCourseList()}
              {currentCourses.length === 0 && (
                <div className="no-courses">
                  <BookOpen size={48} />
                  <h3>No courses in progress</h3>
                  <p>Start learning by enrolling in a course!</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="progress-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="learning-progress">
              <h2>Learning Progress</h2>
              {renderWeeklyActivity()}
              <div className="upcoming-deadlines">
                <h3>Upcoming Deadlines</h3>
                <div className="deadline-list">
                  <div className="deadline-item">
                    <Clock size={16} />
                    <div className="deadline-info">
                      <p>Complete JavaScript Module</p>
                      <span>Due in 2 days</span>
                    </div>
                  </div>
                  <div className="deadline-item">
                    <Clock size={16} />
                    <div className="deadline-info">
                      <p>Submit Final Project</p>
                      <span>Due in 5 days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="achievements-section">
                <header className="section-header">
                  <h3>Recent Achievements</h3>
                  {getCompletedCourses().length > 0 && (
                    <span className="achievements-count">
                      {getCompletedCourses().length} completed
                    </span>
                  )}
                </header>
                {renderAchievements()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, title, value, trend }) {
  return (
    <motion.div 
      className="stat-card"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </motion.div>
  );
}

