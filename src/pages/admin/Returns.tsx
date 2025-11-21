import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { ReturnRequest, ReturnStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RotateCcw, CheckCircle, XCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { AdminHeader } from '@/components/common/AdminHeader';

export default function AdminReturns() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAdminAndLoadData();
  }, [user]);

  const checkAdminAndLoadData = async () => {
    try {
      const profile = await db.profiles.getCurrent();
      if (profile?.role !== 'admin') {
        navigate('/');
        toast.error('Access denied');
        return;
      }
      await loadReturns();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const loadReturns = async () => {
    try {
      setLoading(true);
      const data = await db.returns.getAll();
      setReturns(data);
    } catch (error) {
      console.error('Error loading returns:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: ReturnStatus) => {
    if (!selectedReturn) return;

    try {
      await db.returns.updateStatus(selectedReturn.id, status, adminNotes || undefined);
      toast.success(`Return ${status}`);
      setDialogOpen(false);
      setSelectedReturn(null);
      setAdminNotes('');
      loadReturns();
    } catch (error) {
      console.error('Error updating return:', error);
      toast.error('Failed to update return');
    }
  };

  const openReturnDialog = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setAdminNotes(returnRequest.admin_notes || '');
    setDialogOpen(true);
  };

  const getStatusBadge = (status: ReturnStatus) => {
    const variants: Record<ReturnStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      refunded: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const filteredReturns = returns.filter(returnRequest => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      returnRequest.id.toLowerCase().includes(query) ||
      returnRequest.order_id.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AdminHeader title="Manage Returns" />

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID or Return ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredReturns.length} {filteredReturns.length === 1 ? 'return' : 'returns'}
        </div>

        {filteredReturns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <RotateCcw className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No return requests</h2>
              <p className="text-muted-foreground">Return requests will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReturns.map((returnRequest) => (
              <Card key={returnRequest.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base sm:text-lg">
                      Return Request #{returnRequest.id.slice(0, 8)}
                    </CardTitle>
                    {getStatusBadge(returnRequest.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-semibold text-sm">{returnRequest.order_id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Request Date</p>
                      <p className="font-semibold text-sm">
                        {new Date(returnRequest.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Customer Reason:</p>
                    <p className="text-sm">{returnRequest.reason}</p>
                  </div>
                  {returnRequest.admin_notes && (
                    <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Admin Notes:</p>
                      <p className="text-sm">{returnRequest.admin_notes}</p>
                    </div>
                  )}
                  {returnRequest.status === 'pending' && (
                    <Button onClick={() => openReturnDialog(returnRequest)} className="w-full sm:w-auto">
                      Review Request
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Return Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReturn && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Customer Reason:</p>
                <p className="text-sm">{selectedReturn.reason}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Notes</label>
              <Textarea
                placeholder="Add notes about this return..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleUpdateStatus('approved')}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleUpdateStatus('rejected')}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
