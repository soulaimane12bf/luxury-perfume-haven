import { useState, useEffect } from 'react';
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
  DialogTrigger,
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

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
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

  const handleToggleBestSelling = async (productId) => {
    try {
      await productsApi.toggleBestSelling(productId);
      toast({
        title: 'نجح',
        description: 'تم تحديث حالة المنتج',
      });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تحديث المنتج',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      await productsApi.delete(productId);
      toast({
        title: 'نجح',
        description: 'تم حذف المنتج',
      });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف المنتج',
        variant: 'destructive',
      });
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewsApi.approve(reviewId);
      toast({
        title: 'نجح',
        description: 'تم الموافقة على التقييم',
      });
      fetchAllData();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل الموافقة على التقييم',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    
    try {
      await reviewsApi.delete(reviewId);
      toast({
        title: 'نجح',
        description: 'تم حذف التقييم',
      });
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
    return <div className="container py-20 text-center">جاري التحميل...</div>;
  }

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    bestSellers: products.filter(p => p.best_selling).length,
    pendingReviews: reviews.filter(r => !r.approved).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

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
                <CardTitle>إدارة المنتجات</CardTitle>
                <CardDescription>عرض وتعديل وحذف المنتجات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصورة</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>التقييم</TableHead>
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
                          <TableCell>{product.price} درهم</TableCell>
                          <TableCell>
                            <Badge variant={product.type === 'PRODUIT' ? 'default' : 'secondary'}>
                              {product.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>{product.rating}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
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
                <CardTitle>إدارة الفئات</CardTitle>
                <CardDescription>عرض وتعديل الفئات</CardDescription>
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
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
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
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.name}</TableCell>
                          <TableCell className="text-sm">{review.product_id}</TableCell>
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
                      ))}
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
      </div>
    </div>
  );
}
