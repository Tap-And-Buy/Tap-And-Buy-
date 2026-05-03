import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AdminHeader } from '@/components/common/AdminHeader';

interface UserData {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface AuthUser {
  id: string;
  email: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [pin, setPin] = useState('');
  const [revealedPassword, setRevealedPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  const ADMIN_PIN = '1708';

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.phone?.includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all profiles with encrypted passwords
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(profiles || []);
      setFilteredUsers(profiles || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPassword = (user: UserData) => {
    // Admin accounts cannot view their own passwords
    if (user.role === 'admin') {
      toast.error('Admin passwords cannot be viewed for security reasons');
      return;
    }
    
    // For regular users, require PIN first
    setSelectedUser(user);
    setPin('');
    setPinDialogOpen(true);
  };

  const handlePinSubmit = async () => {
    if (!selectedUser) return;

    if (pin !== ADMIN_PIN) {
      toast.error('Incorrect PIN');
      return;
    }

    // PIN is correct, fetch password from Supabase Auth
    setPinDialogOpen(false);
    setLoadingPassword(true);

    try {
      // Get user from Supabase Auth using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.getUserById(
        selectedUser.id
      );

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User not found in authentication system');
      }

      // For users created through our system, we need to get the password from our Edge Function
      const { data: passwordData, error: passwordError } = await supabase.functions.invoke(
        'get-user-password',
        {
          body: { userId: selectedUser.id },
        }
      );

      if (passwordError) {
        console.error('Password fetch error:', passwordError);
        throw new Error('Unable to retrieve password. This user may have been created before password storage was enabled.');
      }

      if (passwordData?.password) {
        setRevealedPassword(passwordData.password);
        setPasswordDialogOpen(true);
      } else {
        toast.error('Password not available for this user');
      }
    } catch (error) {
      console.error('Error fetching password:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to retrieve password');
    } finally {
      setLoadingPassword(false);
      setPin('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(revealedPassword);
    toast.success('Password copied to clipboard');
  };

  return (
    <>
      <AdminHeader title="User Management" subtitle="View all users and their passwords" backTo="/account" />
      <div className="p-6 max-w-screen-2xl mx-auto">
        <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {searchQuery ? 'No users found' : 'No users yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Users will appear here once they register'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Password</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || '-'}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === 'admin' ? (
                        <span className="text-sm text-muted-foreground">Protected</span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPassword(user)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Password
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* PIN Entry Dialog */}
      <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Security Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                🔒 Please enter the security PIN to view this user's password.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">Security PIN</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePinSubmit();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPinDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePinSubmit} disabled={loadingPassword}>
              {loadingPassword ? 'Verifying...' : 'Verify PIN'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Display Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm font-medium">{selectedUser?.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input
                  value={revealedPassword}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyToClipboard} variant="outline">
                  Copy
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                💡 <strong>Tip:</strong> You can share this password with the user if they forgot it. 
                Advise them to keep it secure.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setPasswordDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
