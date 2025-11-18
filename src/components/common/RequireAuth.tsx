import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  whiteList?: string[];
}

export function RequireAuth({ children, whiteList = [] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const isWhitelisted = whiteList.some(path => {
      if (path.endsWith('/*')) {
        return location.pathname.startsWith(path.slice(0, -2));
      }
      return location.pathname === path;
    });

    if (!user && !isWhitelisted) {
      navigate('/welcome', { replace: true });
    }
  }, [user, loading, location.pathname, navigate, whiteList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
