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
import { Check, Star, Trash2 } from 'lucide-react';
import { DeleteTarget, Product, Review } from '../types';

type ReviewsTabProps = {
  reviews: Review[];
  products: Product[];
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (target: DeleteTarget) => void;
};

export function ReviewsTab({ reviews, products, onApproveReview, onDeleteReview }: ReviewsTabProps) {
  const resolveProductName = (review: Review) => {
    const product = products.find((p) => p.id === review.product_id);
    return product?.name || review.product_id;
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
        <div className="md:hidden space-y-3 p-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-sm">{review.name}</h3>
                <p className="text-xs text-muted-foreground">{resolveProductName(review)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(review.rating, 'sm')}</div>
                {review.approved ? (
                  <Badge variant="default" className="text-xs">
                    موافق عليه
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    معلق
                  </Badge>
                )}
              </div>
              {review.comment && <p className="text-xs text-muted-foreground line-clamp-3">{review.comment}</p>}
              <div className="flex gap-2 pt-2">
                {!review.approved && (
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
                      name: review.name,
                      meta: resolveProductName(review),
                    })
                  }
                  className={!review.approved ? 'flex-1' : 'w-full'}
                >
                  <Trash2 className="h-3 w-3 text-destructive mr-1" />
                  حذف
                </Button>
              </div>
            </Card>
          ))}
          {reviews.length === 0 && <div className="text-sm text-center text-muted-foreground py-6">لا توجد تقييمات</div>}
        </div>

        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>التعليق</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.name}</TableCell>
                  <TableCell className="text-sm">{resolveProductName(review)}</TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating, 'lg')}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>
                    {review.approved ? <Badge variant="default">موافق عليه</Badge> : <Badge variant="secondary">معلق</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!review.approved && (
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
                            name: review.name,
                            meta: resolveProductName(review),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد تقييمات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

