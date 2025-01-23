import React from "react"
import { BookOpen, Clock } from "lucide-react"

export function CourseProgressTracker({ courses }) {
  return (
    <div className="course-progress-tracker">
      <h2>Course Progress</h2>
      <div className="progress-list">
        {courses.map((course) => (
          <div key={course.id} className="progress-item">
            <div className="progress-header">
              <h3>{course.title}</h3>
              <span>{course.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${course.progress}%` }} />
            </div>
            <div className="progress-meta">
              <div className="lessons">
                <BookOpen className="lessons-icon" />
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons
                </span>
              </div>
              <div className="time-left">
                <Clock className="time-icon" />
                <span>{course.estimatedTimeLeft} left</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

