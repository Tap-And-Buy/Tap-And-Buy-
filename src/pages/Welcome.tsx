import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import logoImg from '/logo.png';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <img 
            src={logoImg} 
            alt="Tap And Buy" 
            className="h-24 w-auto mx-auto object-contain"
          />
          <h1 className="text-4xl font-bold text-foreground">Welcome to Tap And Buy</h1>
          <p className="text-muted-foreground text-lg">Your one-stop shop for online shopping</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Access admin dashboard and manage your store</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/login">
                <Button className="w-full" variant="default">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Customer Registration</CardTitle>
              <CardDescription>Create a new account to start shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/register">
                <Button className="w-full" variant="default">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Customer Login</CardTitle>
              <CardDescription>Sign in to your existing account</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button className="w-full" variant="default">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Shop with confidence • Secure payments • Fast delivery</p>
        </div>
      </div>
    </div>
  );
}
