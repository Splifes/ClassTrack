import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function HomeRedirector() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard', { replace: true });
      } else if (user.role === 'coordinator') {
        navigate('/coordinator-dashboard', { replace: true });
      } else {
        // Fallback to a generic dashboard if role is unknown
        navigate('/courses', { replace: true });
      }
    }
    // If no user, the main App component will show the login page
  }, [user, navigate]);

  // Render nothing, or a loading spinner, while redirecting
  return null;
}
