import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Search, Filter, PlayCircle, DollarSign, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SAMPLE_COURSES } from '../data/sampleData';  // Add this import
import "./CoursesPage.css";
// ... (keep the interface definitions as they are)

export function CoursesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [categories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [categories] = useState([
    { id: "programming", name: "Programming" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "marketing", name: "Marketing" }
  ]);
  const [levels] = useState([
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" }
  ]);
  const [courses] = useState(SAMPLE_COURSES);
  const [sortBy, setSortBy] = useState("popular");
  const [filteredCourses, setFilteredCourses] = useState(SAMPLE_COURSES);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Logic to filter and sort courses
    let filtered = courses.filter(course => 
      (!selectedCategory || course.category === selectedCategory) &&
      (!selectedLevel || course.level === selectedLevel) &&
      (!searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort the filtered courses
    switch(sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // "popular"
        filtered.sort((a, b) => b.students_count - a.students_count);
    }

    setFilteredCourses(filtered);
  }, [courses, selectedCategory, selectedLevel, searchQuery, sortBy]);

  const handleEnroll = (courseId) => {
    // Enrollment logic here
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
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
      className="courses-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="courses-header">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Explore Our Courses
        </motion.h1>
        <motion.p
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Discover new skills, expand your knowledge, and advance your career
        </motion.p>
      </div>

      <motion.div 
        className="category-grid"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="category-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="category-icon">
              {getCategoryIcon(category.id)}
            </div>
            <h3>{category.name}</h3>
            <p className="category-count">
              {getCategoryCount(category.id)} courses
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Search and Filters */}
      <motion.div 
        className="search-filters"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter">
            <Filter className="filter-icon" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </motion.div>

      {/* Enhanced Course Grid */}
      <AnimatePresence>
        <motion.div 
          className="course-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="course-card glass-effect hover-effect"
              onClick={() => handleCourseClick(course.id)}
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="course-image">
                <img
                  src={course.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                  alt={course.title}
                />
                <div className="progress-indicator">
                  <Zap />
                </div>
                <div className="course-overlay">
                  <button className="preview-button">
                    <PlayCircle /> Preview
                  </button>
                </div>
              </div>
              
              <div className="course-content">
                <div className="course-tags">
                  <span className="course-tag">{course.level}</span>
                  <span className="course-tag">{course.category}</span>
                </div>
                
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                
                <div className="course-meta">
                  <div className="course-duration">
                    <Clock className="duration-icon" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="course-students">
                    <Users className="students-icon" />
                    <span>{course.students_count} Students</span>
                  </div>
                </div>

                <div className="course-footer">
                  <motion.button 
                    className="enroll-button full-width"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="no-courses">
              <BookOpen className="no-courses-icon" />
              <h3>No courses found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function getCategoryIcon(categoryId) {
  const icons = {
    programming: <BookOpen size={24} />,
    design: <PlayCircle size={24} />,
    business: <DollarSign size={24} />,
    marketing: <Users size={24} />
  };
  return icons[categoryId] || <BookOpen size={24} />;
}

function getCategoryCount(categoryId) {
  // Implementation depends on your data structure
  return Math.floor(Math.random() * 20) + 5; // Placeholder
}

