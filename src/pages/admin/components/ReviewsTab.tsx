import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DeleteTarget, Product, Review } from '../types';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type ReviewsTabProps = {
  reviews: Review[];
  products: Product[];
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (target: DeleteTarget) => void;
};

export function ReviewsTab({ reviews, products, onApproveReview, onDeleteReview }: ReviewsTabProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const toggleReview = (id: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedReviews(newExpanded);
  };

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

  const resolveProductName = (review: Review) => {
    const product = products.find((p) => p.id === review.product_id);
    return product?.name || review.product_id;
  };

  const getReviewName = (review: Review) => {
    return review.customer_name || review.name;
  };

  const getApprovalStatus = (review: Review) => {
    return review.is_approved !== undefined ? review.is_approved : review.approved;
  };

  const formatDate = (review: Review) => {
    const dateStr = review.created_at || review.createdAt;
    if (!dateStr) return 'غير متوفر';
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg') =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div>
          <CardTitle className="text-lg md:text-xl">إدارة التقييمات</CardTitle>
          <CardDescription className="text-xs md:text-sm">الموافقة على التقييمات أو حذفها</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        {/* Mobile View */}
        <div className="md:hidden space-y-3 p-4">
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const isApproved = getApprovalStatus(review);
            const reviewImages = review.images || [];
            
            return (
              <Card key={review.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{getReviewName(review)}</h3>
                    <p className="text-xs text-muted-foreground">{resolveProductName(review)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReview(review.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating, 'sm')}</div>
                  {isApproved ? (
                    <Badge variant="default" className="text-xs bg-green-600">
                      موافق عليه ✓
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-yellow-600 text-white">
                      معلق ⏳
                    </Badge>
                  )}
                </div>

                {review.comment && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                )}

                {isExpanded && (
                  <div className="space-y-3 pt-2 border-t">
                    {/* Full Comment */}
                    {review.comment && (
                      <div>
                        <p className="text-xs font-semibold mb-1">التعليق الكامل:</p>
                        <p className="text-xs text-muted-foreground">{review.comment}</p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(review)}
                    </div>

                    {/* Images */}
                    {reviewImages.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold mb-2 flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          الصور ({reviewImages.length})
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {reviewImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageGallery(review, idx)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {!isApproved && (
                    <Button variant="outline" size="sm" onClick={() => onApproveReview(review.id)} className="flex-1">
                      <Check className="h-3 w-3 text-green-600 mr-1" />
                      موافقة
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      onDeleteReview({
                        type: 'review',
                        id: review.id,
                        name: getReviewName(review),
                        meta: resolveProductName(review),
                      })
                    }
                    className={!isApproved ? 'flex-1' : 'w-full'}
                  >
                    <Trash2 className="h-3 w-3 text-destructive mr-1" />
                    حذف
                  </Button>
                </div>
              </Card>
            );
          })}
          {reviews.length === 0 && <div className="text-sm text-center text-muted-foreground py-6">لا توجد تقييمات</div>}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => {
                const isExpanded = expandedReviews.has(review.id);
                const isApproved = getApprovalStatus(review);
                const reviewImages = review.images || [];
                
                return (
                  <>
                    <TableRow key={review.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell onClick={() => toggleReview(review.id)}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </TableCell>
                      <TableCell className="font-medium">{getReviewName(review)}</TableCell>
                      <TableCell className="text-sm">{resolveProductName(review)}</TableCell>
                      <TableCell>
                        <div className="flex">{renderStars(review.rating, 'lg')}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(review).split(' ').slice(0, 3).join(' ')}
                      </TableCell>
                      <TableCell>
                        {isApproved ? (
                          <Badge variant="default" className="bg-green-600">موافق عليه ✓</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-600 text-white">معلق ⏳</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!isApproved && (
                            <Button variant="ghost" size="icon" onClick={() => onApproveReview(review.id)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onDeleteReview({
                                type: 'review',
                                id: review.id,
                                name: getReviewName(review),
                                meta: resolveProductName(review),
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row */}
                    {isExpanded && (
                      <TableRow key={`${review.id}-expanded`}>
                        <TableCell colSpan={8} className="bg-muted/30 p-6">
                          <div className="space-y-4">
                            {/* Comment */}
                            {review.comment && (
                              <div>
                                <p className="text-sm font-semibold mb-2">التعليق:</p>
                                <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                                  {review.comment}
                                </p>
                              </div>
                            )}

                            {/* Full Date */}
                            <div>
                              <p className="text-sm font-semibold mb-1">تاريخ الإضافة:</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(review)}
                              </div>
                            </div>

                            {/* Images */}
                            {reviewImages.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  الصور المرفقة ({reviewImages.length})
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                  {reviewImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                      <img
                                        src={img}
                                        alt={`Review image ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all border-2 border-transparent hover:border-amber-500"
                                        onClick={() => openImageGallery(review, idx)}
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد تقييمات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

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
                  alt={`Review image ${selectedImageIndex + 1}`}
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
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{getReviewName(selectedReview)}</h3>
                    <p className="text-sm text-muted-foreground">{resolveProductName(selectedReview)}</p>
                  </div>
                  <div className="flex">{renderStars(selectedReview.rating, 'lg')}</div>
                </div>

                {selectedReview.comment && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(selectedReview)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

