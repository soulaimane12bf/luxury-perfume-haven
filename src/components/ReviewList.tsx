import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{review.name}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('ar-MA')}
                </span>
              </div>
              
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
