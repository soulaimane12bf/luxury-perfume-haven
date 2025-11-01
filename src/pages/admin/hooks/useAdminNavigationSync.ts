import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Location } from 'react-router-dom';
import type { AdminTab } from '../types';

type UseAdminNavigationSyncParams = {
  activeTab: AdminTab;
  setActiveTab: Dispatch<SetStateAction<AdminTab>>;
  location: Location;
  navigate: (to: string | { pathname: string; search?: string }, options?: { replace?: boolean }) => void;
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams, options?: { replace?: boolean }) => void;
  productPage: number;
  setProductPage: (page: number) => void;
  bestSellersPage: number;
  setBestSellersPage: (page: number) => void;
};

const isAdminTabValue = (value: string | null): value is AdminTab =>
  Boolean(value && ['orders', 'products', 'categories', 'reviews', 'bestsellers', 'sliders', 'profile'].includes(value));

export const useAdminNavigationSync = ({
  activeTab,
  setActiveTab,
  location,
  navigate,
  searchParams,
  setSearchParams,
  productPage,
  setProductPage,
  bestSellersPage,
  setBestSellersPage,
}: UseAdminNavigationSyncParams) => {
  const handleTabChange = useCallback(
    (tab: string) => {
      if (isAdminTabValue(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('orders');
      }
    },
    [setActiveTab],
  );

  useEffect(() => {
    const p = parseInt(searchParams.get('productsPage') || '1', 10) || 1;
    if (p !== productPage) setProductPage(p);
  }, [productPage, searchParams, setProductPage]);

  useEffect(() => {
    const np = new URLSearchParams(searchParams);
    if (Number(np.get('productsPage') || '1') !== productPage) {
      np.set('productsPage', String(productPage));
      setSearchParams(np, { replace: true });
    }
  }, [productPage, searchParams, setSearchParams]);

  useEffect(() => {
    const bp = parseInt(searchParams.get('bestsellersPage') || '1', 10) || 1;
    if (bp !== bestSellersPage) setBestSellersPage(bp);
  }, [bestSellersPage, searchParams, setBestSellersPage]);

  useEffect(() => {
    const np = new URLSearchParams(searchParams);
    if (Number(np.get('bestsellersPage') || '1') !== bestSellersPage) {
      np.set('bestsellersPage', String(bestSellersPage));
      setSearchParams(np, { replace: true });
    }
  }, [bestSellersPage, searchParams, setSearchParams]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const normalized = isAdminTabValue(tabParam) ? tabParam : 'orders';
    setActiveTab((current) => (current === normalized ? current : normalized));
  }, [location.search, setActiveTab]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === activeTab) {
      return;
    }
    params.set('tab', activeTab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [activeTab, location.pathname, location.search, navigate]);

  useEffect(() => {
    const onPopState = () => {
      try {
        const { pathname, search } = window.location;
        if (pathname !== '/admin') return;
        const params = new URLSearchParams(search);
        const tab = (params.get('tab') as AdminTab) || 'orders';
        if (tab !== activeTab) {
          navigate('/login', { replace: true });
        }
      } catch {
        // ignore popstate errors
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [activeTab, navigate]);

  return { handleTabChange };
};
