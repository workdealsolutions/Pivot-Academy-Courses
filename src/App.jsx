import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { CoursesPage } from "./components/CoursesPage";
import { Settings } from "./components/Settings"; // Add this import
import { AuthForm } from "./components/AuthForm";
import { ThemeProvider } from "./components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/globals.css";
import CourseDetails from "./pages/CourseDetails";
import CourseLearn from './pages/CourseLearn';

// Create a simple auth context
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);

  const authValue = {
    user,
    login: () => {
      setUser({ id: 1, name: 'Test User' });
      // Redirect will happen in AuthForm component
    },
    logout: () => setUser(null),
  };

  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <Router>
        <AuthContext.Provider value={authValue}>
          <motion.div 
            className="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <NavBar />
            <AnimatePresence mode="wait">
              <motion.main 
                className="main-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Routes>
                  <Route path="/" element={user ? <Navigate to="/courses" replace /> : <Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/courses"
                    element={
                      <ProtectedRoute>
                        <CoursesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/courses/:courseId"
                    element={
                      <ProtectedRoute>
                        <CourseDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/courses/:courseId/learn/:moduleId/:lessonId"
                    element={
                      <ProtectedRoute>
                        <CourseLearn />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<AuthForm />} />
                  <Route path="/signup" element={<AuthForm />} />
                </Routes>
              </motion.main>
            </AnimatePresence>
          </motion.div>
        </AuthContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;

