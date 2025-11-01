import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';
import type { Review } from '../types';

type ApiErrorHandler = (error: unknown, operation: string) => void;

type ReviewsSectionParams = {
  handleApiError: ApiErrorHandler;
};

export type ReviewsSectionState = {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
  fetchReviews: () => Promise<void>;
  handleApproveReview: (reviewId: string) => Promise<void>;
  handleDeleteReview: (reviewId: string) => Promise<void>;
};

export function useReviewsSection({ handleApiError }: ReviewsSectionParams): ReviewsSectionState {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async () => {
    try {
      const reviewsData = (await reviewsApi.getAll().catch(() => [])) as unknown;
      setReviews(Array.isArray(reviewsData) ? (reviewsData as Review[]) : []);
    } catch (error) {
      handleApiError(error, 'جلب التقييمات');
    }
  }, [handleApiError]);

  const handleApproveReview = useCallback(
    async (reviewId: string) => {
      try {
        await reviewsApi.approve(reviewId);
        showAdminAlert({ title: '✅ نجح', text: 'تم الموافقة على التقييم', icon: 'success', timer: 3000 });
        await fetchReviews();
      } catch (error) {
        handleApiError(error, 'الموافقة على التقييم');
      }
    },
    [fetchReviews, handleApiError],
  );

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        await reviewsApi.delete(reviewId);
        showAdminAlert({ title: '✅ نجح', text: 'تم حذف التقييم', icon: 'success', timer: 3000 });
        await fetchReviews();
      } catch (error) {
        handleApiError(error, 'حذف التقييم');
        throw error;
      }
    },
    [fetchReviews, handleApiError],
  );

  return {
    reviews,
    setReviews,
    fetchReviews,
    handleApproveReview,
    handleDeleteReview,
  };
}
