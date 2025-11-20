import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Package, Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AdminHeader } from '@/components/common/AdminHeader';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().min(1, 'Price is required'),
  category_id: z.string().min(1, 'Category is required'),
  stock_quantity: z.enum(['in_stock', 'out_of_stock'], {
    required_error: 'Stock status is required',
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category_id: '',
      stock_quantity: 'in_stock' as const,
    },
  });

  useEffect(() => {
    checkAdminAndLoadData();
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find(c => c.id === product.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products, categories]);

  const checkAdminAndLoadData = async () => {
    try {
      const profile = await db.profiles.getCurrent();
      if (profile?.role !== 'admin') {
        navigate('/');
        toast.error('Access denied');
        return;
      }
      await loadData();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        db.products.getAll(),
        db.categories.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalImages = previewUrls.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 1024 * 1024) {
        toast.error(`${file.name} must be smaller than 1MB`);
        continue;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const totalImages = previewUrls.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      if (file.size > 1024 * 1024) {
        toast.error(`${file.name} must be smaller than 1MB`);
        continue;
      }

      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setUploading(true);
      const imageUrls: string[] = [];

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const url = await db.storage.uploadProductImage(file);
          imageUrls.push(url);
        }
      } else if (editingProduct && editingProduct.image_urls) {
        imageUrls.push(...editingProduct.image_urls);
      }

      const productData = {
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        category_id: data.category_id || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        stock_quantity: data.stock_quantity === 'in_stock' ? 100 : 0,
        is_active: true,
      };

      if (editingProduct) {
        if (selectedFiles.length > 0 && editingProduct.image_urls) {
          for (const oldUrl of editingProduct.image_urls) {
            try {
              await db.storage.deleteProductImage(oldUrl);
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }
        }
        await db.products.update(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await db.products.create(productData);
        toast.success('Product created successfully');
      }
      setDialogOpen(false);
      form.reset();
      setEditingProduct(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity > 0 ? 'in_stock' as const : 'out_of_stock' as const,
    });
    if (product.image_urls && product.image_urls.length > 0) {
      setPreviewUrls(product.image_urls);
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await db.products.delete(id);
      toast.success('Product deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
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
      <AdminHeader title="Manage Products" />

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search products by name, description, or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            {searchTerm && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              form.reset();
              setEditingProduct(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Wireless Headphones" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product description..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹) *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="299.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stock_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Status *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={field.value === 'in_stock' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => field.onChange('in_stock')}
                              >
                                In Stock
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === 'out_of_stock' ? 'default' : 'outline'}
                                className="flex-1"
                                onClick={() => field.onChange('out_of_stock')}
                              >
                                Out of Stock
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Images (Max 5)</label>
                    <div className="flex flex-col gap-3">
                      {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-full h-32 border rounded-lg overflow-hidden bg-muted">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      {previewUrls.length < 5 && (
                        <div
                          className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                            isDragging 
                              ? 'border-primary bg-primary/10' 
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {isDragging ? 'Drop images here' : `Click or drag to upload ${previewUrls.length > 0 ? 'more' : ''} images`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {previewUrls.length}/5 images • Max 1MB each
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={uploading}>
                      {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        form.reset();
                        setEditingProduct(null);
                        setSelectedFiles([]);
                        setPreviewUrls([]);
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {searchTerm ? 'No products found' : 'No products yet'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try a different search term' : 'Create your first product to start selling'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader className="p-0">
                  {product.image_urls?.[0] ? (
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>
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
