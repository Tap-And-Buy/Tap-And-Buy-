import { Link, useLocation, useNavigate } from 'react-router';
import { Home, Grid3x3, ShoppingCart, User, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '@/db/api';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      db.cart.getItems().then(items => {
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      }).catch(() => setCartCount(0));
    }
  }, [user, location.pathname]);

  const handleNavClick = (path: string, requiresAuth: boolean) => (e: React.MouseEvent) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      navigate('/welcome');
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', requiresAuth: false },
    { path: '/categories', icon: Grid3x3, label: 'Categories', requiresAuth: false },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: cartCount, requiresAuth: true },
    { path: '/account', icon: User, label: 'Account', requiresAuth: true },
    { path: '/support', icon: Headphones, label: 'Support', requiresAuth: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick(item.path, item.requiresAuth)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative',
                'transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
