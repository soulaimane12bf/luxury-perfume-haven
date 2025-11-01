import { Fragment } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { DeleteTarget, Order, OrderItem } from '../types';
import { formatOrderDate } from '../utils';

type OrdersTabProps = {
  orders: Order[];
  stats: {
    totalOrders: number;
    pendingOrders: number;
  };
  expandedOrders: Set<string>;
  onToggleOrderDetails: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onContactCustomer: (order: Order) => void;
  openDeleteDialog: (target: DeleteTarget) => void;
};

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'processing', label: 'قيد التجهيز' },
  { value: 'shipped', label: 'تم الشحن' },
  { value: 'delivered', label: 'تم التسليم' },
  { value: 'cancelled', label: 'ملغي' },
];

const getStatusLabel = (status?: string) =>
  ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label || status || 'غير محدد';

export function OrdersTab({
  orders,
  stats,
  expandedOrders,
  onToggleOrderDetails,
  onUpdateOrderStatus,
  onContactCustomer,
  openDeleteDialog,
}: OrdersTabProps) {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div>
          <CardTitle className="text-lg md:text-xl">إدارة الطلبات</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {stats.totalOrders} طلب - {stats.pendingOrders} قيد الانتظار
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onToggleOrderDetails(order.id)}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        {expandedOrders.has(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {order.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        {Array.isArray(order.items) && order.items.length > 0 && (
                          <div className="mt-1 flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item: OrderItem, index: number) => {
                                const src = item.image_url || item.image || item.image_urls?.[0] || '';
                                return (
                                  <img
                                    key={index}
                                    src={src}
                                    alt={item.name || 'product'}
                                    className="h-8 w-8 rounded object-cover border bg-white"
                                  />
                                );
                              })}
                              {order.items.length > 3 && (
                                <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs ml-1">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground max-w-[220px] truncate">
                              {order.items[0]?.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-primary">{order.total_amount} درهم</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select value={order.status} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatOrderDate(order)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            onContactCustomer(order);
                          }}
                          title="تواصل مع العميل عبر واتساب"
                        >
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDeleteDialog({ type: 'order', id: order.id, name: order.customer_name, meta: order.customer_phone });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedOrders.has(order.id) && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={6} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-sm mb-2">تفاصيل العميل</h4>
                            <div className="space-y-1 text-xs">
                              {order.customer_name && (
                                <div>
                                  <span className="font-medium">الاسم:</span> {order.customer_name}
                                </div>
                              )}
                              {order.customer_phone && (
                                <div>
                                  <span className="font-medium">الهاتف:</span> {order.customer_phone}
                                </div>
                              )}
                              {order.customer_email && (
                                <div>
                                  <span className="font-medium">البريد:</span> {order.customer_email}
                                </div>
                              )}
                              {order.customer_address && (
                                <div>
                                  <span className="font-medium">العنوان:</span> {order.customer_address}
                                </div>
                              )}
                              {order.shipping_address && (
                                <div>
                                  <span className="font-medium">عنوان الشحن:</span> {order.shipping_address}
                                </div>
                              )}
                              {order.city && (
                                <div>
                                  <span className="font-medium">المدينة:</span> {order.city}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">المنتجات</h4>
                            <div className="space-y-1">
                              {Array.isArray(order.items) &&
                                order.items.map((item: OrderItem, idx: number) => {
                                  const img = item.image_url || item.image || item.image_urls?.[0] || '';
                                  return (
                                    <div key={idx} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img
                                          src={img}
                                          alt={item.name}
                                          className="h-12 w-12 rounded object-cover flex-shrink-0 bg-white border"
                                        />
                                        <div className="min-w-0">
                                          <div className="font-medium truncate">{item.name}</div>
                                          {item.variant && (
                                            <div className="text-xs text-muted-foreground truncate">{item.variant}</div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm">x{item.quantity}</div>
                                        <div className="font-medium">{item.price * item.quantity} درهم</div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <div className="flex justify-between font-bold text-sm">
                                <span>المجموع:</span>
                                <span>{order.total_amount} درهم</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">الحالة</h4>
                              <Badge variant="secondary">{getStatusLabel(order.status)}</Badge>
                            </div>
                            <div className="space-y-3">
                              <Select value={order.status} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => onContactCustomer(order)}>
                                  تواصل مع العميل
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() =>
                                    openDeleteDialog({
                                      type: 'order',
                                      id: order.id,
                                      name: order.customer_name,
                                      meta: order.customer_phone,
                                    })
                                  }
                                >
                                  حذف الطلب
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {order.notes && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">ملاحظات:</h4>
                            <p className="text-xs text-muted-foreground">{order.notes}</p>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">التاريخ: {formatOrderDate(order)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    لا توجد طلبات حالياً.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-3 p-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">رقم الطلب</div>
                    <div className="font-semibold">{order.id}</div>
                  </div>
                  <Badge variant="secondary">{getStatusLabel(order.status)}</Badge>
                </div>
              <div>
                <div className="text-xs text-muted-foreground">العميل</div>
                <div className="font-medium">{order.customer_name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">المبلغ</div>
                <div className="font-semibold">{order.total_amount} درهم</div>
              </div>
              <div className="space-y-2 border-t pt-2 text-xs">
                {order.customer_phone && <div>الهاتف: {order.customer_phone}</div>}
                {order.customer_email && <div>البريد: {order.customer_email}</div>}
                {order.city && <div>المدينة: {order.city}</div>}
              </div>
              <div className="space-y-2">
                <Select value={order.status} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">التاريخ: {formatOrderDate(order)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => onContactCustomer(order)}>
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      openDeleteDialog({
                        type: 'order',
                        id: order.id,
                        name: order.customer_name,
                        meta: order.customer_phone,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {orders.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">لا توجد طلبات حالياً.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
