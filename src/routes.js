import { HomePage } from './pages/Home/HomePage';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { CourseList } from './pages/Courses/CourseList';
import { CourseDetails } from './pages/Courses/CourseDetails';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { Settings } from './pages/Settings/Settings';

export const routes = [
  {
    path: '/',
    element: HomePage,
    isPublic: true
  },
  {
    path: '/dashboard',
    element: Dashboard,
    isProtected: true
  },
  {
    path: '/courses',
    element: CourseList,
    isProtected: true
  },
  {
    path: '/courses/:id',
    element: CourseDetails,
    isProtected: true
  },
  {
    path: '/login',
    element: Login,
    isPublic: true
  },
  {
    path: '/signup',
    element: Signup,
    isPublic: true
  },
  {
    path: '/settings',
    element: Settings,
    isProtected: true
  }
];
