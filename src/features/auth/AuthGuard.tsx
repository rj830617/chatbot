import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Loading } from '../../components/common/Loading';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated && !loading) {
      navigate('/login');
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <Card padding="lg">
          <Loading message="Checking authentication..." />
        </Card>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
};