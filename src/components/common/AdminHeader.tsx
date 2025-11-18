import { Link } from 'react-router';
import logoImg from '/logo.png';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function AdminHeader({ title, subtitle, showBackButton = true, backTo = '/admin/dashboard' }: AdminHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img 
              src={logoImg} 
              alt="Tap And Buy" 
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        {showBackButton && (
          <Link to={backTo}>
            <Button variant="ghost" size="sm" className="mt-2 text-primary-foreground hover:bg-primary-foreground/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
