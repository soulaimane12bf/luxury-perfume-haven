import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { slidersApi } from '@/lib/api';
import { compressImage } from '@/lib/imageCompression';
import showAdminAlert from '@/lib/swal-admin';
import type { Slider } from '../types';

type ApiErrorHandler = (error: unknown, operation: string) => void;

type SliderFormState = {
  image_url: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  order: number;
  active: boolean;
};

type SlidersSectionParams = {
  handleApiError: ApiErrorHandler;
};

export type SlidersSectionState = {
  sliders: Slider[];
  setSliders: Dispatch<SetStateAction<Slider[]>>;
  sliderDialog: boolean;
  setSliderDialog: (open: boolean) => void;
  editingSlider: Slider | null;
  setEditingSlider: Dispatch<SetStateAction<Slider | null>>;
  sliderForm: SliderFormState;
  setSliderForm: Dispatch<SetStateAction<SliderFormState>>;
  sliderImage: File | null;
  setSliderImage: Dispatch<SetStateAction<File | null>>;
  openSliderDialog: (slider?: Slider) => void;
  handleSaveSlider: () => Promise<void>;
  handleDeleteSlider: (sliderId: string) => Promise<void>;
  fetchSliders: () => Promise<void>;
};

const DEFAULT_SLIDER_FORM: SliderFormState = {
  image_url: '',
  title: '',
  subtitle: '',
  button_text: '',
  button_link: '',
  order: 0,
  active: true,
};

export function useSlidersSection({ handleApiError }: SlidersSectionParams): SlidersSectionState {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [sliderDialog, setSliderDialog] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [sliderForm, setSliderForm] = useState<SliderFormState>(DEFAULT_SLIDER_FORM);
  const [sliderImage, setSliderImage] = useState<File | null>(null);

  const fetchSliders = useCallback(async () => {
    try {
      const slidersData = (await slidersApi.getAll().catch(() => [])) as unknown;
      setSliders(Array.isArray(slidersData) ? (slidersData as Slider[]) : []);
    } catch (error) {
      handleApiError(error, 'جلب السلايدر');
    }
  }, [handleApiError]);

  const openSliderDialog = useCallback((slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider);
      setSliderForm({
        image_url: slider.image_url || '',
        title: slider.title || '',
        subtitle: slider.subtitle || '',
        button_text: slider.button_text || '',
        button_link: slider.button_link || '',
        order: slider.order || 0,
        active: slider.active !== undefined ? slider.active : true,
      });
    } else {
      setEditingSlider(null);
      setSliderForm(DEFAULT_SLIDER_FORM);
    }
    setSliderImage(null);
    setSliderDialog(true);
  }, []);

  const handleSaveSlider = useCallback(async () => {
    try {
      if (!sliderImage && !editingSlider) {
        showAdminAlert({ title: '❌ خطأ', text: 'يرجى اختيار صورة للسلايدر', icon: 'error', timer: 5000 });
        return;
      }

      if (!sliderForm.title) {
        showAdminAlert({ title: '❌ خطأ', text: 'يرجى إدخال عنوان السلايدر', icon: 'error', timer: 5000 });
        return;
      }

      const formData = new FormData();

      if (sliderImage) {
        const compressedImage = await compressImage(sliderImage, 3, 1920);
        formData.append('image', compressedImage);
      }

      formData.append('title', sliderForm.title);
      formData.append('subtitle', sliderForm.subtitle);
      formData.append('button_text', sliderForm.button_text);
      formData.append('button_link', sliderForm.button_link);
      formData.append('order', sliderForm.order.toString());
      formData.append('active', sliderForm.active.toString());

      if (editingSlider) {
        await slidersApi.update(editingSlider.id, formData);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث السلايدر بنجاح', icon: 'success', timer: 3000 });
      } else {
        await slidersApi.create(formData);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة السلايدر بنجاح', icon: 'success', timer: 3000 });
      }

      setSliderDialog(false);
      setSliderImage(null);
      await fetchSliders();
    } catch (error) {
      handleApiError(error, editingSlider ? 'تحديث السلايدر' : 'إضافة السلايدر');
    }
  }, [editingSlider, fetchSliders, handleApiError, sliderForm, sliderImage]);

  const handleDeleteSlider = useCallback(
    async (sliderId: string) => {
      try {
        await slidersApi.delete(sliderId);
        showAdminAlert({ title: '✅ نجح', text: 'تم حذف السلايدر', icon: 'success', timer: 3000 });
        await fetchSliders();
      } catch (error) {
        handleApiError(error, 'حذف السلايدر');
        throw error;
      }
    },
    [fetchSliders, handleApiError],
  );

  return {
    sliders,
    setSliders,
    sliderDialog,
    setSliderDialog,
    editingSlider,
    setEditingSlider,
    sliderForm,
    setSliderForm,
    sliderImage,
    setSliderImage,
    openSliderDialog,
    handleSaveSlider,
    handleDeleteSlider,
    fetchSliders,
  };
}
