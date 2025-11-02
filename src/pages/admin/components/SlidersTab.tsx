import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { DeleteTarget, Slider } from '../types';

type SlidersTabProps = {
  sliders: Slider[];
  onOpenSliderDialog: (slider?: Slider) => void;
  onOpenDeleteDialog: (target: DeleteTarget) => void;
};

export function SlidersTab({ sliders, onOpenSliderDialog, onOpenDeleteDialog }: SlidersTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>إدارة السلايدر</CardTitle>
          <CardDescription>إدارة صور وعروض السلايدر الرئيسي</CardDescription>
        </div>
        <Button onClick={() => onOpenSliderDialog()}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة شريحة جديدة
        </Button>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصورة</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sliders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد شرائح. قم بإضافة شريحة جديدة للبدء.
                  </TableCell>
                </TableRow>
              ) : (
                sliders.map((slider) => (
                  <TableRow key={slider.id}>
                    <TableCell>
                      <img src={slider.image_url} alt={slider.title || 'Slider'} className="h-16 w-24 object-cover rounded" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{slider.title || 'بدون عنوان'}</p>
                        {slider.subtitle && <p className="text-sm text-muted-foreground">{slider.subtitle}</p>}
                      </div>
                    </TableCell>
                    <TableCell>{slider.order}</TableCell>
                    <TableCell>
                      <Badge variant={slider.active ? 'default' : 'secondary'}>{slider.active ? 'نشط' : 'غير نشط'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onOpenSliderDialog(slider)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onOpenDeleteDialog({ type: 'slider', id: slider.id, name: slider.title })}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {sliders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              لا توجد شرائح. قم بإضافة شريحة جديدة للبدء.
            </div>
          ) : (
            sliders.map((slider) => (
              <Card key={slider.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={slider.image_url} 
                    alt={slider.title || 'Slider'} 
                    className="w-full h-32 object-cover" 
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={slider.active ? 'default' : 'secondary'}>
                      {slider.active ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <p className="font-medium text-sm">{slider.title || 'بدون عنوان'}</p>
                    {slider.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{slider.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>الترتيب: {slider.order}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onOpenSliderDialog(slider)}
                    >
                      <Edit className="h-4 w-4 ml-2" />
                      تعديل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onOpenDeleteDialog({ type: 'slider', id: slider.id, name: slider.title })}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

