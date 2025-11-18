import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { db } from '@/db/api';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isInWishlist?: boolean;
  onWishlistChange?: () => void;
}

export function ProductCard({ product, isInWishlist = false, onWishlistChange }: ProductCardProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Tap And Buy!`,
      url: `${window.location.origin}/product/${product.id}`,
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

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsTogglingWishlist(true);
    try {
      const newState = await db.wishlist.toggle(product.id);
      setIsWishlisted(newState);
      toast.success(newState ? 'Added to wishlist' : 'Removed from wishlist');
      onWishlistChange?.();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const imageUrl = product.image_urls?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleWishlist}
            disabled={isTogglingWishlist}
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
          {product.stock_quantity > 0 ? (
            <span className="text-xs text-muted-foreground">In Stock</span>
          ) : (
            <span className="text-xs text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
