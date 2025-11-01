import { useCallback, useState } from 'react';
import type { DeleteTarget } from '../types';

type UseAdminDeleteDialogParams = {
  handleDeleteProduct: (id: string) => Promise<void>;
  handleDeleteCategory: (id: string) => Promise<void>;
  handleDeleteReview: (id: string) => Promise<void>;
  handleDeleteOrder: (id: string) => Promise<void>;
  handleDeleteSlider: (id: string) => Promise<void>;
};

export const useAdminDeleteDialog = ({
  handleDeleteProduct,
  handleDeleteCategory,
  handleDeleteReview,
  handleDeleteOrder,
  handleDeleteSlider,
}: UseAdminDeleteDialogParams) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = useCallback((target: DeleteTarget) => {
    setDeleteTarget(target);
    setDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      switch (deleteTarget.type) {
        case 'product':
          await handleDeleteProduct(deleteTarget.id);
          break;
        case 'category':
          await handleDeleteCategory(deleteTarget.id);
          break;
        case 'review':
          await handleDeleteReview(deleteTarget.id);
          break;
        case 'order':
          await handleDeleteOrder(deleteTarget.id);
          break;
        case 'slider':
          await handleDeleteSlider(deleteTarget.id);
          break;
        default:
          break;
      }
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, handleDeleteCategory, handleDeleteOrder, handleDeleteProduct, handleDeleteReview, handleDeleteSlider]);

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
  };
};

