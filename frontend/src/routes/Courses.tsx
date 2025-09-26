import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Courses() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole) {
      let path;
      switch (userRole) {
        case 'student':
          path = '/courses/student';
          break;
        case 'teacher':
          path = '/courses/teacher';
          break;
        case 'coordinator':
          path = '/courses/coordinator';
          break;
        default:
          // Fallback to student view if role is unknown or not handled
          path = '/courses/student';
          break;
      }
      navigate(path, { replace: true });
    }
  }, [userRole, navigate]);

  // Render a loading state while determining the role and redirecting
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading appropriate course view...</span>
      </div>
    </div>
  );
}
