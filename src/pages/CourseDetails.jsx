import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Add useNavigate
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Users, BookOpen } from 'lucide-react';
import { SAMPLE_COURSES } from '../data/sampleData';  // Add this import
import { COURSE_MODULES } from '../data/courseModules';  // Add this import
import './CourseDetails.css';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate(); // Add this
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to get course details
    // Replace this with your actual API call
    const fetchCourse = async () => {
      // For now, we'll use the sample course data
      const sampleCourse = SAMPLE_COURSES.find(c => c.id === parseInt(courseId));
      setCourse(sampleCourse);
      setLoading(false);
    };

    fetchCourse();
  }, [courseId]);

  if (loading || !course) {
    return <div className="loading">Loading...</div>;
  }

  const handleStartLearning = () => {
    const firstModule = COURSE_MODULES[course.id]?.[0];
    const firstLesson = firstModule?.lessons?.[0];
    
    if (firstModule && firstLesson) {
      navigate(`/courses/${courseId}/learn/${firstModule.id}/${firstLesson.id}`);
    }
  };

  return (
    <motion.div 
      className="course-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="course-header">
        <div className="course-header-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-meta-info">
            <div className="meta-item">
              <Clock />
              <span>{course.duration}</span>
            </div>
            <div className="meta-item">
              <Users />
              <span>{course.students_count} students</span>
            </div>
            <div className="meta-item">
              <BookOpen />
              <span>{course.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content-container">
        <div className="course-modules">
          <h2>Course Content</h2>
          <div className="modules-list">
            {COURSE_MODULES[course.id]?.map((module) => (
              <div key={module.id} className="module">
                <h3>{module.title}</h3>
                <div className="lessons-list">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="lesson">
                      <div className="lesson-info">
                        <PlayCircle size={16} />
                        <span className="lesson-title">{lesson.title}</span>
                      </div>
                      <span className="lesson-duration">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="start-learning">
          <button className="start-button" onClick={handleStartLearning}>
            <PlayCircle />
            Start Learning
          </button>
        </div>
      </div>
    </motion.div>
  );
}
