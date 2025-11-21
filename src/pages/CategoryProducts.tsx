import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { db } from '@/db/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid3x3, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ProductCard } from '@/components/common/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function CategoryProducts() {
  useScrollToTop();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('id');
  const categoryName = searchParams.get('name') || 'Category';
  const searchParam = searchParams.get('search');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  const loadProducts = useCallback(async (catId: string) => {
    try {
      setLoading(true);
      const data = await db.products.getAll(catId);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSearchResults = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      const data = await db.products.search(searchTerm);
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const wishlistIds = await db.wishlist.getProductIds();
      setWishlistProductIds(wishlistIds);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, [user]);

  useEffect(() => {
    if (searchParam) {
      loadSearchResults(searchParam);
    } else if (categoryId) {
      loadProducts(categoryId);
    } else if (minPriceParam || maxPriceParam) {
      loadAllProducts();
    }
    loadWishlist();
  }, [categoryId, minPriceParam, maxPriceParam, searchParam, loadProducts, loadSearchResults, loadAllProducts, loadWishlist]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, minPriceParam, maxPriceParam]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (minPriceParam) {
      const minPrice = parseFloat(minPriceParam);
      filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPriceParam) {
      const maxPrice = parseFloat(maxPriceParam);
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // If there's a local search query (different from URL search param), filter by it
    if (searchQuery && searchQuery !== searchParam) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by stock status first (in stock first, out of stock last)
    filtered.sort((a, b) => {
      if (a.stock_quantity === 0 && b.stock_quantity > 0) return 1;
      if (a.stock_quantity > 0 && b.stock_quantity === 0) return -1;
      
      // Then apply the selected sort
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);

    // Show recommended products based on search similarity
    if (searchQuery && searchQuery.length >= 2) {
      const recommended = products
        .filter(p => {
          const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
          const descMatch = p.description?.toLowerCase().includes(searchQuery.toLowerCase());
          return nameMatch || descMatch;
        })
        .slice(0, 8);
      
      setRecommendedProducts(recommended);
    } else {
      setRecommendedProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const getPageTitle = () => {
    if (minPriceParam && maxPriceParam) {
      return `Products ₹${minPriceParam} - ₹${maxPriceParam}`;
    } else if (minPriceParam) {
      return `Products Above ₹${minPriceParam}`;
    } else if (maxPriceParam) {
      return `Products Under ₹${maxPriceParam}`;
    }
    return categoryName;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <Link to={categoryId ? "/categories" : "/"}>
            <Button variant="ghost" size="sm" className="mb-2 text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {categoryId ? 'Back to Categories' : 'Back to Home'}
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredProducts.length === 0 ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <Grid3x3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try a different search term' : 'No products available in this category'}
                </p>
              </CardContent>
            </Card>

            {recommendedProducts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Recommended Products</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInWishlist={wishlistProductIds.includes(product.id)}
                      onWishlistChange={loadWishlist}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProductIds.includes(product.id)}
                onWishlistChange={loadWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
