import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { db } from '@/db/api';
import type { Product, PromotionalImage } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Search, Tag, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/common/ProductCard';
import logoImg from '/logo.png';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionalImage[]>([]);
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [priceRangeProducts, setPriceRangeProducts] = useState<{
    under20: Product[];
    range20to50: Product[];
    range50to100: Product[];
    range100to200: Product[];
    range200to500: Product[];
    range500to800: Product[];
    range800to1000: Product[];
    above1000: Product[];
  }>({
    under20: [],
    range20to50: [],
    range50to100: [],
    range100to200: [],
    range200to500: [],
    range500to800: [],
    range800to1000: [],
    above1000: [],
  });

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSuggestions]);

  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPromotionIndex((prevIndex) => 
        prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [promotions.length]);

  const loadData = async () => {
    try {
      const [promoData, productData, recentData, historyData, wishlistIds] = await Promise.all([
        db.promotionalImages.getActive(),
        db.products.getAll(),
        user ? db.recentlyViewed.getRecent(10) : Promise.resolve([]),
        user ? db.searchHistory.getRecent(5) : Promise.resolve([]),
        user ? db.wishlist.getProductIds() : Promise.resolve([]),
      ]);

      setPromotions(promoData);
      setAllProducts(productData);
      setProducts(productData.slice(0, 30));
      setRecentlyViewed(recentData);
      setSearchHistory(historyData.map(h => h.search_term));
      setWishlistProductIds(wishlistIds);

      // Sort products: in-stock first, out-of-stock last
      const sortedProducts = [...productData].sort((a, b) => {
        if (a.stock_quantity === 0 && b.stock_quantity > 0) return 1;
        if (a.stock_quantity > 0 && b.stock_quantity === 0) return -1;
        return 0;
      });

      const categorizedProducts = {
        under20: sortedProducts.filter(p => p.price < 20).slice(0, 10),
        range20to50: sortedProducts.filter(p => p.price >= 20 && p.price < 50).slice(0, 10),
        range50to100: sortedProducts.filter(p => p.price >= 50 && p.price < 100).slice(0, 10),
        range100to200: sortedProducts.filter(p => p.price >= 100 && p.price < 200).slice(0, 10),
        range200to500: sortedProducts.filter(p => p.price >= 200 && p.price < 500).slice(0, 10),
        range500to800: sortedProducts.filter(p => p.price >= 500 && p.price < 800).slice(0, 10),
        range800to1000: sortedProducts.filter(p => p.price >= 800 && p.price < 1000).slice(0, 10),
        above1000: sortedProducts.filter(p => p.price >= 1000).slice(0, 10),
      };
      setPriceRangeProducts(categorizedProducts);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    
    if (value.trim().length >= 2) {
      const suggestions = allProducts.filter(product => 
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
    navigate(`/category-products?search=${encodeURIComponent(productName)}`);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    if (user) {
      await db.searchHistory.add(searchTerm);
    }

    setShowSuggestions(false);
    navigate(`/category-products?search=${encodeURIComponent(searchTerm)}`);
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
              onChange={e => handleSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
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

            {showSuggestions && searchSuggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
                <CardContent className="p-2">
                  {searchSuggestions.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded flex items-center gap-3"
                      onClick={() => handleSuggestionClick(product.name)}
                    >
                      {product.image_urls && product.image_urls.length > 0 && (
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">₹{product.price}</p>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
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

      <div className="max-w-screen-xl mx-auto p-4 space-y-8 pb-24">
        {promotions.length > 0 && (
          <section>
            <div className="relative w-full">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={promotions[currentPromotionIndex].image_url}
                  alt={promotions[currentPromotionIndex].title || 'Promotion'}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
              
              {promotions.length > 1 && (
                <>
                  {currentPromotionIndex > 0 && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                      onClick={() => setCurrentPromotionIndex(currentPromotionIndex - 1)}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  )}
                  
                  {currentPromotionIndex < promotions.length - 1 && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                      onClick={() => setCurrentPromotionIndex(currentPromotionIndex + 1)}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
                  
                  <div className="flex justify-center gap-2 mt-4">
                    {promotions.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentPromotionIndex 
                            ? 'w-8 bg-primary' 
                            : 'w-2 bg-muted-foreground/30'
                        }`}
                        onClick={() => setCurrentPromotionIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">All Time Offers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-primary/20 bg-background/50">
              <CardContent className="p-4 text-center">
                <Tag className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-lg">₹40 OFF</p>
                <p className="text-sm text-muted-foreground">On orders with 10+ products</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-background/50">
              <CardContent className="p-4 text-center">
                <Tag className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-lg">₹80 OFF</p>
                <p className="text-sm text-muted-foreground">On orders with 20+ products</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-background/50">
              <CardContent className="p-4 text-center">
                <Tag className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold text-lg">₹150 OFF</p>
                <p className="text-sm text-muted-foreground">On orders with 35+ products</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {priceRangeProducts.under20.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Under ₹20</h2>
              <Link to="/category-products?maxPrice=20">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.under20.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range20to50.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹20 - ₹50</h2>
              <Link to="/category-products?minPrice=20&maxPrice=50">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range20to50.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range50to100.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹50 - ₹100</h2>
              <Link to="/category-products?minPrice=50&maxPrice=100">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range50to100.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range100to200.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹100 - ₹200</h2>
              <Link to="/category-products?minPrice=100&maxPrice=200">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range100to200.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range200to500.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹200 - ₹500</h2>
              <Link to="/category-products?minPrice=200&maxPrice=500">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range200to500.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range500to800.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹500 - ₹800</h2>
              <Link to="/category-products?minPrice=500&maxPrice=800">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range500to800.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.range800to1000.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">₹800 - ₹1000</h2>
              <Link to="/category-products?minPrice=800&maxPrice=1000">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.range800to1000.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {priceRangeProducts.above1000.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Above ₹1000</h2>
              <Link to="/category-products?minPrice=1000">
                <Button variant="link" className="text-primary">View All →</Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {priceRangeProducts.above1000.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[200px] snap-start">
                  <ProductCard
                    product={product}
                    isInWishlist={wishlistProductIds.includes(product.id)}
                    onWishlistChange={loadData}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
