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
      <CardHeader className="flex flex-row items-center justify-between">
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
      </CardContent>
    </Card>
  );
}

