import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { PromotionalImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminHeader } from '@/components/common/AdminHeader';

const promotionSchema = z.object({
  image_url: z.string().url('Must be a valid URL'),
  link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

export default function AdminPromotions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<PromotionalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      image_url: '',
      link_url: '',
    },
  });

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
      await loadPromotions();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await db.promotionalImages.getAll();
      setPromotions(data);
    } catch (error) {
      console.error('Error loading promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PromotionFormData) => {
    try {
      const maxOrder = promotions.length > 0 
        ? Math.max(...promotions.map(p => p.display_order)) 
        : 0;
      
      await db.promotionalImages.create({
        title: null,
        image_url: data.image_url,
        link_url: data.link_url || null,
        display_order: maxOrder + 1,
        is_active: true,
      });
      toast.success('Promotional image added successfully');
      setDialogOpen(false);
      form.reset();
      loadPromotions();
    } catch (error) {
      console.error('Error adding promotion:', error);
      toast.error('Failed to add promotional image');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.promotionalImages.delete(id);
      toast.success('Promotional image deleted successfully');
      loadPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Failed to delete promotional image');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await db.promotionalImages.update(id, { is_active: !currentStatus });
      toast.success(`Promotional image ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadPromotions();
    } catch (error) {
      console.error('Error updating promotion:', error);
      toast.error('Failed to update promotional image');
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
      <AdminHeader title="Manage Promotions" subtitle="Homepage promotional images" />

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) form.reset();
          }}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Promotional Image</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/banner.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/offer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Add</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {promotions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No promotional images</h2>
              <p className="text-muted-foreground mb-4">Add promotional images for your homepage</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <Card key={promo.id}>
                <CardHeader className="p-0">
                  <img
                    src={promo.image_url}
                    alt="Promotional banner"
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p className={`text-sm font-semibold ${promo.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {promo.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  {promo.link_url && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Link</p>
                      <p className="text-sm truncate">{promo.link_url}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleActive(promo.id, promo.is_active)}
                    >
                      {promo.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Promotional Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this promotional image? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(promo.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
