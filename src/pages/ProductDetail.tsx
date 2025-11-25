import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '@/db/api';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Zap, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ProductCard } from '@/components/common/ProductCard';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function ProductDetail() {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(id);
      checkWishlistStatus(id);
      loadRelatedProducts();
      setCurrentImageIndex(0);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await db.products.getById(productId);
      setProduct(data);
      setCurrentImageIndex(0);
      
      if (user) {
        await db.recentlyViewed.add(productId);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const allProducts = await db.products.getAll();
      const currentProduct = allProducts.find(p => p.id === id);
      
      if (!currentProduct) return;

      let related = allProducts.filter(p => 
        p.id !== id && 
        p.category_id === currentProduct.category_id
      ).slice(0, 8);

      if (related.length < 8) {
        const priceRange = currentProduct.price * 0.3;
        const additionalProducts = allProducts.filter(p => 
          p.id !== id && 
          !related.find(r => r.id === p.id) &&
          Math.abs(p.price - currentProduct.price) <= priceRange
        ).slice(0, 8 - related.length);
        
        related = [...related, ...additionalProducts];
      }

      setRelatedProducts(related);

      if (user) {
        const wishlistIds = await db.wishlist.getProductIds();
        setWishlistProductIds(wishlistIds);
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const checkWishlistStatus = async (productId: string) => {
    if (!user) return;
    try {
      const inWishlist = await db.wishlist.isInWishlist(productId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (product?.image_urls && currentImageIndex < product.image_urls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      // Swiped left - next image
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      // Swiped right - previous image
      handlePreviousImage();
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Tap And Buy!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Product shared successfully');
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Product link copied to clipboard');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share product');
      }
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/welcome');
      return;
    }

    if (!product) return;
    
    setIsTogglingWishlist(true);
    try {
      const newState = await db.wishlist.toggle(product.id);
      setIsInWishlist(newState);
      toast.success(newState ? 'Added to wishlist' : 'Removed from wishlist');
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/welcome');
      return;
    }

    if (!product) return;

    try {
      await db.cart.addItem(product.id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/welcome');
      return;
    }

    if (!product) return;

    try {
      await db.cart.clear();
      await db.cart.addItem(product.id, quantity);
      navigate('/checkout');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to proceed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Product Details</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {product.image_urls && product.image_urls.length > 0 ? (
              <div className="relative">
                <div 
                  className="aspect-square bg-muted rounded-lg overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={product.image_urls[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200"
                  />
                </div>
                
                {product.image_urls.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    )}
                    
                    {currentImageIndex < product.image_urls.length - 1 && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    )}
                  </>
                )}
                
                {product.image_urls.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {product.image_urls.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'w-8 bg-primary' 
                            : 'w-2 bg-muted-foreground/30'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No Image Available</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold flex-1">{product.name}</h1>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleWishlist}
                    disabled={isTogglingWishlist}
                  >
                    <Heart 
                      className={`h-5 w-5 transition-colors ${
                        isInWishlist ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>
              <p className="text-4xl font-bold text-primary">₹{product.price}</p>
            </div>

            {product.description && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleBuyNow}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2 text-sm">
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <p>• Delivery within 6-8 days</p>
                <p>• Delivery charge: ₹60</p>
                <p>• Prepaid payment only</p>
                <p>• Return available for damaged items (within 12 hours)</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  isInWishlist={wishlistProductIds.includes(relatedProduct.id)}
                  onWishlistChange={loadRelatedProducts}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
