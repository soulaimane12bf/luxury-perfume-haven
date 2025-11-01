import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Star, ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface Review {
  id: string;
  product_id: string;
  customer_name?: string;
  name?: string;
  rating: number;
  comment: string;
  approved?: boolean;
  is_approved?: boolean;
  images?: string[];
  likes?: number;
  dislikes?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const openImageGallery = (review: Review, imageIndex: number) => {
    setSelectedReview(review);
    setSelectedImageIndex(imageIndex);
  };

  const closeImageGallery = () => {
    setSelectedReview(null);
    setSelectedImageIndex(0);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedReview?.images && selectedReview.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % selectedReview.images!.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedReview?.images && selectedReview.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + selectedReview.images!.length) % selectedReview.images!.length);
    }
  };

  const formatDate = (review: Review) => {
    const dateSource = review.created_at || review.createdAt || review.updated_at || review.updatedAt;
    if (!dateSource) return 'الآن';
    try {
      const parsed = new Date(dateSource);
      if (Number.isNaN(parsed.getTime())) return 'الآن';
      return parsed.toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'الآن';
    }
  };

  if (reviews.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => {
          const reviewName = review.customer_name || review.name || 'مستخدم';

          return (
            <Card key={review.id} className="p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3 md:gap-4">
                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-amber-500">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold">
                    {reviewName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <h4 className="font-semibold text-base md:text-lg truncate">{reviewName}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(review)}
                    </span>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 md:h-5 md:w-5 ${
                          i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm md:text-base text-muted-foreground mb-3 leading-relaxed">{review.comment}</p>
                  
                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                      {review.images.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => openImageGallery(review, index)}
                          className="flex-shrink-0 group relative"
                        >
                          <img
                            src={imageUrl}
                            alt={`صورة التقييم ${index + 1}`}
                            className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-lg border-2 border-amber-200 group-hover:border-amber-500 transition-all cursor-pointer hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AliExpress-Style Image Gallery Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={closeImageGallery}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          {selectedReview && selectedReview.images && selectedReview.images.length > 0 && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={closeImageGallery}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Main Image */}
              <div className="relative">
                <img
                  src={selectedReview.images[selectedImageIndex]}
                  alt={`صورة التقييم ${selectedImageIndex + 1}`}
                  className="w-full max-h-[70vh] object-contain"
                />

                {/* Navigation Arrows - Always show if more than 1 image */}
                {selectedReview.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full h-14 w-14 shadow-xl z-50"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full h-14 w-14 shadow-xl z-50"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                  {selectedImageIndex + 1} / {selectedReview.images.length}
                </div>
              </div>

              {/* Review Details Below Image */}
              <div className="bg-white dark:bg-gray-900 p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10 border-2 border-amber-500">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white font-bold">
                        {(selectedReview.customer_name || selectedReview.name || 'مستخدم').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedReview.customer_name || selectedReview.name || 'مستخدم'}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(selectedReview)}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedReview.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {selectedReview.comment && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedReview.comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
