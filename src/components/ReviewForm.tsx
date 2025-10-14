import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !rating || !comment) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.create({
        product_id: productId,
        name,
        rating,
        comment,
      });
      
      toast({
        title: 'شكراً لك!',
        description: 'تم إرسال تقييمك بنجاح. سيظهر بعد المراجعة.',
      });
      
      setName('');
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال التقييم',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">أضف تقييمك</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك"
            required
          />
        </div>

        <div>
          <Label>التقييم</Label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comment">التعليق</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك رأيك في العطر..."
            rows={4}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </Button>
      </form>
    </Card>
  );
}
