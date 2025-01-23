import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COURSE_MODULES } from '../data/courseModules';
import { SAMPLE_COURSES } from '../data/sampleData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CourseLearn.css';

export default function CourseLearn() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const courseData = SAMPLE_COURSES.find(c => c.id === parseInt(courseId));
    const moduleData = COURSE_MODULES[courseId]?.find(m => m.id === parseInt(moduleId));
    const lessonData = moduleData?.lessons.find(l => l.id === parseInt(lessonId));

    setCourse(courseData);
    setCurrentModule(moduleData);
    setCurrentLesson(lessonData);

    // Update progress in localStorage when lesson changes
    if (courseData && moduleData && lessonData) {
      const progress = calculateProgress(courseId, moduleId, lessonId);
      updateCourseProgress(courseData, progress);
    }
  }, [courseId, moduleId, lessonId]);

  const calculateProgress = (courseId, currentModuleId, currentLessonId) => {
    const allModules = COURSE_MODULES[courseId];
    const totalLessons = allModules.reduce((total, module) => total + module.lessons.length, 0);
    
    let completedLessons = 0;
    allModules.forEach(module => {
      if (module.id < currentModuleId) {
        completedLessons += module.lessons.length;
      } else if (module.id === parseInt(currentModuleId)) {
        completedLessons += parseInt(currentLessonId);
      }
    });

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const updateCourseProgress = (courseData, progress) => {
    const inProgressCourses = JSON.parse(localStorage.getItem('inProgressCourses') || '[]');
    
    const courseIndex = inProgressCourses.findIndex(c => c.id === courseData.id);
    if (courseIndex >= 0) {
      inProgressCourses[courseIndex].progress = progress;
    } else {
      inProgressCourses.push({
        id: courseData.id,
        title: courseData.title,
        progress: progress,
        lastAccessed: new Date().toISOString()
      });
    }

    localStorage.setItem('inProgressCourses', JSON.stringify(inProgressCourses));
  };

  const navigateToLesson = (newModuleId, newLessonId) => {
    navigate(`/courses/${courseId}/learn/${newModuleId}/${newLessonId}`);
  };

  const handleNext = () => {
    const currentModuleIndex = COURSE_MODULES[courseId].findIndex(m => m.id === currentModule.id);
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      navigateToLesson(moduleId, currentModule.lessons[currentLessonIndex + 1].id);
    } else if (currentModuleIndex < COURSE_MODULES[courseId].length - 1) {
      // First lesson of next module
      const nextModule = COURSE_MODULES[courseId][currentModuleIndex + 1];
      navigateToLesson(nextModule.id, nextModule.lessons[0].id);
    }
  };

  if (!course || !currentModule || !currentLesson) {
    return <div>Loading...</div>;
  }

  return (
    <div className="course-learn">
      <div className="lesson-content">
        <h1>{currentLesson.title}</h1>
        <div className="video-container">
          {/* Placeholder for video content */}
          <div className="video-placeholder">
            <h3>Lesson Video Content</h3>
            <p>Duration: {currentLesson.duration}</p>
          </div>
        </div>
        
        <div className="navigation-controls">
          {currentLesson.id > 1 && (
            <button onClick={() => navigateToLesson(moduleId, currentLesson.id - 1)}>
              <ChevronLeft /> Previous
            </button>
          )}
          <button onClick={handleNext}>
            Next <ChevronRight />
          </button>
        </div>
      </div>

      <div className="course-sidebar">
        <h2>Course Content</h2>
        {COURSE_MODULES[courseId].map(module => (
          <div key={module.id} className="sidebar-module">
            <h3>{module.title}</h3>
            <div className="sidebar-lessons">
              {module.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  className={`sidebar-lesson ${
                    currentLesson.id === lesson.id ? 'active' : ''
                  }`}
                  onClick={() => navigateToLesson(module.id, lesson.id)}
                >
                  {lesson.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
