import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Category, DeleteTarget } from '../types';

type CategoriesTabProps = {
  categories: Category[];
  onOpenCategoryDialog: (category?: Category) => void;
  onOpenDeleteDialog: (target: DeleteTarget) => void;
};

export function CategoriesTab({ categories, onOpenCategoryDialog, onOpenDeleteDialog }: CategoriesTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">إدارة الفئات</CardTitle>
            <CardDescription className="text-xs md:text-sm">عرض وتعديل الفئات</CardDescription>
          </div>
          <Button onClick={() => onOpenCategoryDialog()} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            إضافة فئة
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="md:hidden space-y-3 p-4">
          {categories.map((category) => (
            <Card key={category.id} className="p-4">
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.slug}</p>
                </div>
                {category.description && <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onOpenCategoryDialog(category)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenDeleteDialog({ type: 'category', id: category.id, name: category.name })}
                    className="flex-1"
                  >
                    <Trash2 className="h-3 w-3 text-destructive mr-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {categories.length === 0 && <div className="text-sm text-center text-muted-foreground py-6">لا توجد فئات</div>}
        </div>

        <div className="hidden md:block rounded-md border">
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
                      <Button variant="ghost" size="icon" onClick={() => onOpenCategoryDialog(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenDeleteDialog({ type: 'category', id: category.id, name: category.name })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد فئات
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

