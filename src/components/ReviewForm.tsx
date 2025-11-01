import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import { reviewsApi } from '@/lib/api';
import Swal from 'sweetalert2';
import { compressMultipleImages } from '@/lib/imageCompressor';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 3 images
    const filesToAdd = files.slice(0, 3 - images.length);
    
    if (filesToAdd.length < files.length) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'يمكنك إضافة 3 صور كحد أقصى',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }

    setCompressing(true);
    try {
      // Compress images before adding
      const compressedFiles = await compressMultipleImages(filesToAdd, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.85
      });

      // Create previews
      const newPreviews = await Promise.all(
        compressedFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      setImages(prev => [...prev, ...compressedFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `تم إضافة ${compressedFiles.length} صورة`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'فشل ضغط الصور. حاول مرة أخرى',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !rating || !comment) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'الرجاء ملء جميع الحقول',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('name', name);
      formData.append('rating', rating.toString());
      formData.append('comment', comment);
      
      // Add images to form data
      images.forEach((image) => {
        formData.append('images', image);
      });

      await reviewsApi.create(formData);
      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'شكراً لك!',
        text: 'تم إرسال تقييمك بنجاح. سيظهر بعد المراجعة.',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
      
      setName('');
      setRating(0);
      setComment('');
      setImages([]);
      setImagePreviews([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء إرسال التقييم',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 border-2 border-amber-200 dark:border-amber-900">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-amber-900 dark:text-amber-100 flex items-center gap-2">
        <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
        أضف تقييمك
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name" className="text-base font-semibold">الاسم</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك"
            className="mt-2 h-11"
            required
          />
        </div>

        <div>
          <Label className="text-base font-semibold">التقييم</Label>
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full p-1"
                aria-label={`تقييم ${star} نجوم`}
              >
                <Star
                  className={`h-9 w-9 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comment" className="text-base font-semibold">التعليق</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك رأيك في العطر... ما الذي أعجبك؟ هل تنصح به؟"
            rows={4}
            className="mt-2 resize-none"
            required
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <Label className="text-base font-semibold flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            إضافة صور (اختياري - حتى 3 صور)
          </Label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            disabled={images.length >= 3 || compressing}
          />
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-amber-200 dark:border-amber-800">
                  <img
                    src={preview}
                    alt={`معاينة ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="حذف الصورة"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Upload Button */}
          {images.length < 3 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing}
              className="mt-3 w-full h-12 border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
            >
              <Upload className="h-5 w-5 ml-2" />
              {compressing ? 'جاري معالجة الصور...' : `اختر ${images.length > 0 ? 'المزيد من ' : ''}الصور`}
            </Button>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" 
          disabled={submitting || compressing}
        >
          {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </Button>
      </form>
    </Card>
  );
}
