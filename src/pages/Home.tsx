import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { db } from '@/db/api';
import type { Product, PromotionalImage } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/common/ProductCard';
import logoImg from '/logo.png';

export default function Home() {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<PromotionalImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [promoData, productData, recentData, historyData, wishlistIds] = await Promise.all([
        db.promotionalImages.getActive(),
        db.products.getAll(),
        user ? db.recentlyViewed.getRecent(6) : Promise.resolve([]),
        user ? db.searchHistory.getRecent(5) : Promise.resolve([]),
        user ? db.wishlist.getProductIds() : Promise.resolve([]),
      ]);

      setPromotions(promoData);
      setProducts(productData.slice(0, 12));
      setRecentlyViewed(recentData);
      setSearchHistory(historyData.map(h => h.search_term));
      setWishlistProductIds(wishlistIds);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    if (user) {
      await db.searchHistory.add(searchTerm);
    }

    window.location.href = `/categories?search=${encodeURIComponent(searchTerm)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={logoImg} 
              alt="Tap And Buy" 
              className="h-10 w-auto object-contain"
            />
            <h1 className="text-xl font-bold">Tap And Buy</h1>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="bg-white text-foreground pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchHistory.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch();
                  }}
                  className="text-xs bg-primary-foreground/20 hover:bg-primary-foreground/30 px-2 py-1 rounded"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4 space-y-8">
        {promotions.length > 0 && (
          <section>
            <Carousel className="w-full">
              <CarouselContent>
                {promotions.map(promo => (
                  <CarouselItem key={promo.id}>
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                      <img
                        src={promo.image_url}
                        alt={promo.title || 'Promotion'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={wishlistProductIds.includes(product.id)}
                  onWishlistChange={loadData}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isInWishlist={wishlistProductIds.includes(product.id)}
                onWishlistChange={loadData}
              />
            ))}
          </div>
        </section>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
