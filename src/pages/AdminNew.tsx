import { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { productsApi, categoriesApi, reviewsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  FolderTree, 
  Star, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Check,
  X
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  category: string;
  type: string;
  size: string;
  description: string;
  notes: {
    main_notes: string[];
    top_notes: string[];
  } | null;
  image_urls: string[];
  stock: number;
  rating: string;
  best_selling: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

type Review = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brand: '',
    price: '',
    category: '',
    type: 'PRODUIT',
    size: '100ml',
    description: '',
    main_notes: '',
    top_notes: '',
    image_urls: '',
    stock: 0,
  });

  // Category form state
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [productsData, categoriesData, reviewsData] = await Promise.all([
        productsApi.getAll({}),
        categoriesApi.getAll(),
        reviewsApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Product handlers
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: product.category,
        type: product.type,
        size: product.size || '100ml',
        description: product.description || '',
        main_notes: product.notes?.main_notes?.join(', ') || '',
        top_notes: product.notes?.top_notes?.join(', ') || '',
        image_urls: product.image_urls?.join('\n') || '',
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        id: '',
        name: '',
        brand: '',
        price: '',
        category: '',
        type: 'PRODUIT',
        size: '100ml',
        description: '',
        main_notes: '',
        top_notes: '',
        image_urls: '',
        stock: 0,
      });
    }
    setProductDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        notes: {
          main_notes: productForm.main_notes.split(',').map(n => n.trim()).filter(Boolean),
          top_notes: productForm.top_notes.split(',').map(n => n.trim()).filter(Boolean),
        },
        image_urls: productForm.image_urls.split('\n').map(url => url.trim()).filter(Boolean),
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData);
        toast({ title: 'نجح', description: 'تم تحديث المنتج بنجاح' });
      } else {
        await productsApi.create(productData);
        toast({ title: 'نجح', description: 'تم إضافة المنتج بنجاح' });
      }
      
      setProductDialog(false);
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حفظ المنتج',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      await productsApi.delete(productId);
      toast({ title: 'نجح', description: 'تم حذف المنتج' });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف المنتج',
        variant: 'destructive',
      });
    }
  };

  const handleToggleBestSelling = async (productId: string) => {
    try {
      const result = await productsApi.toggleBestSelling(productId);
      toast({
        title: 'نجح',
        description: result.best_selling ? 'تمت الإضافة للأكثر مبيعاً' : 'تمت الإزالة من الأكثر مبيعاً',
      });
      // Update local state immediately
      setProducts(products.map(p => 
        p.id === productId ? { ...p, best_selling: result.best_selling } : p
      ));
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المنتج',
        variant: 'destructive',
      });
    }
  };

  // Category handlers
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image_url: category.image_url || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        image_url: '',
      });
    }
    setCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryForm);
        toast({ title: 'نجح', description: 'تم تحديث الفئة بنجاح' });
      } else {
        await categoriesApi.create(categoryForm);
        toast({ title: 'نجح', description: 'تم إضافة الفئة بنجاح' });
      }
      
      setCategoryDialog(false);
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حفظ الفئة',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    
    try {
      await categoriesApi.delete(categoryId);
      toast({ title: 'نجح', description: 'تم حذف الفئة' });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف الفئة',
        variant: 'destructive',
      });
    }
  };

  // Review handlers
  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsApi.approve(reviewId);
      toast({ title: 'نجح', description: 'تم الموافقة على التقييم' });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل الموافقة على التقييم',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    
    try {
      await reviewsApi.delete(reviewId);
      toast({ title: 'نجح', description: 'تم حذف التقييم' });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف التقييم',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <div className="container py-20 text-center">جاري التحميل...</div>
      </div>
    );
  }

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    bestSellers: products.filter(p => p.best_selling).length,
    pendingReviews: reviews.filter(r => !r.approved).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الفئات</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الأكثر مبيعاً</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bestSellers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تقييمات معلقة</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
            <TabsTrigger value="bestsellers">الأكثر مبيعاً</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة المنتجات</CardTitle>
                    <CardDescription>عرض وتعديل وحذف المنتجات</CardDescription>
                  </div>
                  <Button onClick={() => openProductDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة منتج
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصورة</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.price} درهم</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openProductDialog(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>إدارة الفئات</CardTitle>
                    <CardDescription>عرض وتعديل الفئات</CardDescription>
                  </div>
                  <Button onClick={() => openCategoryDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة فئة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>الرمز</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openCategoryDialog(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>إدارة التقييمات</CardTitle>
                <CardDescription>الموافقة على التقييمات أو حذفها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
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
                      {reviews.map((review) => {
                        const product = products.find(p => p.id === review.product_id);
                        return (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">{review.name}</TableCell>
                            <TableCell className="text-sm">{product?.name || review.product_id}</TableCell>
                            <TableCell>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                            <TableCell>
                              {review.approved ? (
                                <Badge variant="default">موافق عليه</Badge>
                              ) : (
                                <Badge variant="secondary">معلق</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!review.approved && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApproveReview(review.id)}
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Best Sellers Tab */}
          <TabsContent value="bestsellers">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الأكثر مبيعاً</CardTitle>
                <CardDescription>تبديل حالة "الأكثر مبيعاً" للمنتجات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المنتج</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الأكثر مبيعاً</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>{product.price} درهم</TableCell>
                          <TableCell>
                            <Switch
                              checked={product.best_selling}
                              onCheckedChange={() => handleToggleBestSelling(product.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={productDialog} onOpenChange={setProductDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'تعديل بيانات المنتج' : 'أدخل بيانات المنتج الجديد'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-id">معرّف المنتج</Label>
                  <Input
                    id="product-id"
                    value={productForm.id}
                    onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                    placeholder="product-id-slug"
                    disabled={!!editingProduct}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-name">اسم المنتج</Label>
                  <Input
                    id="product-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-brand">العلامة التجارية</Label>
                  <Input
                    id="product-brand"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">السعر (درهم)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-category">الفئة</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-type">النوع</Label>
                  <Select
                    value={productForm.type}
                    onValueChange={(value) => setProductForm({ ...productForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUIT">PRODUIT</SelectItem>
                      <SelectItem value="TESTEUR">TESTEUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">المخزون</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">الوصف</Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-notes">النفحات الرئيسية (مفصولة بفواصل)</Label>
                  <Input
                    id="main-notes"
                    value={productForm.main_notes}
                    onChange={(e) => setProductForm({ ...productForm, main_notes: e.target.value })}
                    placeholder="woody, spicy, floral"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="top-notes">النفحات العليا (مفصولة بفواصل)</Label>
                  <Input
                    id="top-notes"
                    value={productForm.top_notes}
                    onChange={(e) => setProductForm({ ...productForm, top_notes: e.target.value })}
                    placeholder="Bergamot, Lavender, Rose"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-urls">روابط الصور (كل رابط في سطر)</Label>
                <Textarea
                  id="image-urls"
                  value={productForm.image_urls}
                  onChange={(e) => setProductForm({ ...productForm, image_urls: e.target.value })}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setProductDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveProduct}>
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Category Dialog */}
        <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'تعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">اسم الفئة</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-slug">الرمز (Slug)</Label>
                <Input
                  id="category-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="category-slug"
                  disabled={!!editingCategory}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">الوصف</Label>
                <Textarea
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-image">رابط الصورة</Label>
                <Input
                  id="category-image"
                  value={categoryForm.image_url}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCategoryDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
