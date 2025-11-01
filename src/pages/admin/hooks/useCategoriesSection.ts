import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { categoriesApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';
import type { Category, CategoryForm } from '../types';

type ApiErrorHandler = (error: unknown, operation: string) => void;

export type CategoriesSectionState = {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  categoryDialog: boolean;
  setCategoryDialog: (open: boolean) => void;
  editingCategory: Category | null;
  setEditingCategory: Dispatch<SetStateAction<Category | null>>;
  categoryForm: CategoryForm;
  setCategoryForm: Dispatch<SetStateAction<CategoryForm>>;
  openCategoryDialog: (category?: Category) => void;
  handleSaveCategory: () => Promise<void>;
  handleDeleteCategory: (categoryId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
};

type CategoriesSectionParams = {
  handleApiError: ApiErrorHandler;
};

const DEFAULT_CATEGORY_FORM: CategoryForm = {
  name: '',
  slug: '',
  description: '',
};

export function useCategoriesSection({ handleApiError }: CategoriesSectionParams): CategoriesSectionState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(DEFAULT_CATEGORY_FORM);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = (await categoriesApi.getAll().catch(() => [])) as unknown;
      setCategories(Array.isArray(categoriesData) ? (categoriesData as Category[]) : []);
    } catch (error) {
      handleApiError(error, 'جلب الفئات');
    }
  }, [handleApiError]);

  const openCategoryDialog = useCallback((category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm(DEFAULT_CATEGORY_FORM);
    }
    setCategoryDialog(true);
  }, []);

  const handleSaveCategory = useCallback(async () => {
    try {
      const payload = editingCategory ? { ...categoryForm, image_url: editingCategory.image_url } : categoryForm;
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, payload);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث الفئة بنجاح', icon: 'success', timer: 3000 });
      } else {
        await categoriesApi.create(payload);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة الفئة بنجاح', icon: 'success', timer: 3000 });
      }

      setCategoryDialog(false);
      await fetchCategories();
    } catch (error) {
      handleApiError(error, editingCategory ? 'تحديث الفئة' : 'إضافة الفئة');
    }
  }, [categoryForm, editingCategory, fetchCategories, handleApiError]);

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        await categoriesApi.delete(categoryId);
        showAdminAlert({ title: '✅ نجح', text: 'تم حذف الفئة', icon: 'success', timer: 3000 });
        await fetchCategories();
      } catch (error) {
        handleApiError(error, 'حذف الفئة');
        throw error;
      }
    },
    [fetchCategories, handleApiError],
  );

  return {
    categories,
    setCategories,
    categoryDialog,
    setCategoryDialog,
    editingCategory,
    setEditingCategory,
    categoryForm,
    setCategoryForm,
    openCategoryDialog,
    handleSaveCategory,
    handleDeleteCategory,
    fetchCategories,
  };
}
