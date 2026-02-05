import { useEffect, useState } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import { db } from '@/db/api';
import type { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Grid3x3, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

export default function Categories() {
  useScrollToTop();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await db.categories.getAll();
      
      // Define category popularity order (most popular first)
      const popularityOrder = [
        'Health and Personal Care',
        'Home and Kitchen',
        'Electronics',
        'Fashion',
        'Beauty',
        'Sports and Fitness',
        'Books and Stationery',
        'Toys and Games',
        'Automotive',
        'Pet Supplies',
        'Gifts'
      ];
      
      // Sort categories by popularity
      const sortedCategories = data.sort((a, b) => {
        const indexA = popularityOrder.indexOf(a.name);
        const indexB = popularityOrder.indexOf(b.name);
        
        // If both are in the list, sort by their position
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        // If only A is in the list, it comes first
        if (indexA !== -1) return -1;
        // If only B is in the list, it comes first
        if (indexB !== -1) return 1;
        // If neither is in the list, maintain alphabetical order
        return a.name.localeCompare(b.name);
      });
      
      setCategories(sortedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/category-products?id=${categoryId}&name=${encodeURIComponent(categoryName)}`);
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
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Grid3x3 className="h-6 w-6" />
            Categories
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Grid3x3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No categories available</h2>
              <p className="text-muted-foreground">Categories will appear here once added by admin</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(category => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all overflow-hidden"
                onClick={() => handleCategoryClick(category.id, category.name)}
              >
                <CardContent className="p-0">
                  {category.image_url && (
                    <div className="w-full h-40 bg-muted">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 flex items-center justify-between">
                      {category.name}
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
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

