import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to customer login - admins use the same login
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}
