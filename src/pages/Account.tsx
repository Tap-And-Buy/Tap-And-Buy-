import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Package, MapPin, LogOut, Shield, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';

export default function Account() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      navigate('/login');
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await db.profiles.getCurrent();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold">My Account</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile?.full_name && (
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{profile.full_name}</p>
              </div>
            )}
            {profile?.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>
            )}
            {profile?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{profile.phone}</p>
              </div>
            )}
            {profile?.role === 'admin' && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">Admin Account</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/orders')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">My Orders</h3>
                  <p className="text-sm text-muted-foreground">View order history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/addresses')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">My Addresses</h3>
                  <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/wishlist')}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">My Wishlist</h3>
                  <p className="text-sm text-muted-foreground">View saved products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {profile?.role === 'admin' && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-5 w-5" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/products')}>
                  Products
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/categories')}>
                  Categories
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/orders')}>
                  Orders
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/returns')}>
                  Returns
                </Button>
                <Button variant="outline" onClick={() => navigate('/admin/promotions')}>
                  Promotions
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-semibold mb-2">Need Help?</p>
            <p>Contact us at: <a href="mailto:tapandbuy.in@gmail.com" className="text-primary hover:underline">tapandbuy.in@gmail.com</a></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
