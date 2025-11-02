import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import AdminProfile from '@/components/AdminProfile';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import { StatsCards } from './components/StatsCards';
import { OrdersTab } from './components/OrdersTab';
import { ProductsTab } from './components/ProductsTab';
import { CategoriesTab } from './components/CategoriesTab';
import { ReviewsTab } from './components/ReviewsTab';
import { BestSellersTab } from './components/BestSellersTab';
import { SlidersTab } from './components/SlidersTab';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { ProductDialog } from './components/ProductDialog';
import { CategoryDialog } from './components/CategoryDialog';
import { SliderDialog } from './components/SliderDialog';

export default function AdminDashboard() {
  const {
    loading,
    activeTab,
    navigationTabs,
    stats,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    handleTabChange,
    products,
    orders,
    filteredProducts,
    productSearchQuery,
    setProductSearchQuery,
    productDialog,
    setProductDialog,
    editingProduct,
    productForm,
    setProductForm,
    productImages,
    setProductImages,
    existingImageUrls,
    setExistingImageUrls,
    productPage,
    setProductPage,
    productTotalPages,
    productTotal,
    productLimit,
    categories,
    categoryDialog,
    setCategoryDialog,
    editingCategory,
    categoryForm,
    setCategoryForm,
    reviews,
    bestSellersProducts,
    bestSellersPage,
    setBestSellersPage,
    bestSellersTotalPages,
    bestSellersTotal,
    bestSellersLimit,
    sliders,
    sliderDialog,
    setSliderDialog,
    editingSlider,
    sliderForm,
    setSliderForm,
    sliderImage,
    setSliderImage,
    expandedOrders,
    toggleOrderDetails,
    deleteDialogOpen,
    isDeleting,
    deleteTargetLabel,
    deleteTargetDetails,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    openProductDialog,
    handleSaveProduct,
    handleToggleBestSelling,
    openCategoryDialog,
    handleSaveCategory,
    handleApproveReview,
    handleUpdateOrderStatus,
    handleContactCustomer,
    handleLogout,
    handleSaveSlider,
    openSliderDialog,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="relative flex h-screen overflow-hidden bg-white">
        <div className="hidden md:flex">
          <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout} className="md:translate-x-0" />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSidebar} />
            <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] animate-in slide-in-from-right-full duration-300">
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  handleTabChange(tab);
                  closeSidebar();
                }}
                onLogout={handleLogout}
                onClose={closeSidebar}
                isMobile
                className="h-full"
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <AdminNavbar showMenuButton onToggleSidebar={toggleSidebar} />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">جاري التحميل...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-white">
      <div className="hidden md:flex">
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} onLogout={handleLogout} />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSidebar} />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] animate-in slide-in-from-right-full duration-300">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                handleTabChange(tab);
                closeSidebar();
              }}
              onLogout={handleLogout}
              onClose={closeSidebar}
              isMobile
              className="h-full"
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar showMenuButton onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20">
          <div className="container py-4 md:py-8 px-4 space-y-6">
            <div className="md:hidden">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="justify-between bg-white border-amber-200">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {navigationTabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <StatsCards stats={stats} />

            <div className="space-y-6">
              {activeTab === 'orders' && (
                <OrdersTab
                  orders={orders}
                  stats={{ totalOrders: stats.totalOrders, pendingOrders: stats.pendingOrders }}
                  expandedOrders={expandedOrders}
                  onToggleOrderDetails={toggleOrderDetails}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onContactCustomer={handleContactCustomer}
                  openDeleteDialog={openDeleteDialog}
                />
              )}

              {activeTab === 'products' && (
                <ProductsTab
                  filteredProducts={filteredProducts}
                  productSearchQuery={productSearchQuery}
                  onSearchChange={setProductSearchQuery}
                  onOpenProductDialog={openProductDialog}
                  onOpenDeleteDialog={openDeleteDialog}
                  productPage={productPage}
                  productTotalPages={productTotalPages}
                  productTotal={productTotal}
                  productLimit={productLimit}
                  onPageChange={setProductPage}
                />
              )}

              {activeTab === 'categories' && (
                <CategoriesTab categories={categories} onOpenCategoryDialog={openCategoryDialog} onOpenDeleteDialog={openDeleteDialog} />
              )}

              {activeTab === 'reviews' && (
                <ReviewsTab
                  reviews={reviews}
                  products={products}
                  onApproveReview={handleApproveReview}
                  onDeleteReview={openDeleteDialog}
                />
              )}

              {activeTab === 'bestsellers' && (
                <BestSellersTab
                  products={bestSellersProducts}
                  total={bestSellersTotal}
                  page={bestSellersPage}
                  totalPages={bestSellersTotalPages}
                  limit={bestSellersLimit}
                  onPageChange={setBestSellersPage}
                  onToggleBestSelling={handleToggleBestSelling}
                />
              )}

              {activeTab === 'sliders' && (
                <SlidersTab sliders={sliders} onOpenSliderDialog={openSliderDialog} onOpenDeleteDialog={openDeleteDialog} />
              )}

              {activeTab === 'profile' && <AdminProfile />}
            </div>
          </div>
        </main>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        isDeleting={isDeleting}
        itemLabel={deleteTargetLabel}
        itemDetails={deleteTargetDetails}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

      <ProductDialog
        open={productDialog}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        categories={categories}
        productImages={productImages}
        setProductImages={setProductImages}
        existingImageUrls={existingImageUrls}
        setExistingImageUrls={setExistingImageUrls}
        onClose={() => setProductDialog(false)}
        onSave={handleSaveProduct}
      />

      <CategoryDialog
        open={categoryDialog}
        editingCategory={editingCategory}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onClose={() => setCategoryDialog(false)}
        onSave={handleSaveCategory}
      />

      <SliderDialog
        open={sliderDialog}
        editingSlider={editingSlider}
        sliderForm={sliderForm}
        setSliderForm={setSliderForm}
        sliderImage={sliderImage}
        setSliderImage={setSliderImage}
        categories={categories}
        onClose={() => setSliderDialog(false)}
        onSave={handleSaveSlider}
      />

      <ScrollToTopButton />
    </div>
  );
}
