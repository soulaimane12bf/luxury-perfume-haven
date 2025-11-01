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

type OrderDetailsSectionProps = {
  order: Order;
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onContactCustomer: (order: Order) => void;
  openDeleteDialog: (target: DeleteTarget) => void;
  showManagementControls?: boolean;
  layout?: 'desktop' | 'mobile';
};

const OrderDetailsSection = ({
  order,
  onUpdateOrderStatus,
  onContactCustomer,
  openDeleteDialog,
  showManagementControls = true,
  layout = 'desktop',
}: OrderDetailsSectionProps) => {
  const gridClasses =
    layout === 'mobile'
      ? 'grid grid-cols-1 gap-4 text-sm'
      : showManagementControls
        ? 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'
        : 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm';

  return (
    <div className="space-y-4">
      <div className={gridClasses}>
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
        {showManagementControls && (
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
        )}
      </div>
      {order.notes && (
        <div>
          <h4 className="font-semibold text-sm mb-1">ملاحظات:</h4>
          <p className="text-xs text-muted-foreground">{order.notes}</p>
        </div>
      )}
      <div className="text-xs text-muted-foreground">التاريخ: {formatOrderDate(order)}</div>
    </div>
  );
};

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
                            onToggleOrderDetails(order.id);
                          }}
                          aria-label={expandedOrders.has(order.id) ? 'إخفاء تفاصيل الطلب' : 'عرض تفاصيل الطلب'}
                        >
                          {expandedOrders.has(order.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
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
                      <TableCell colSpan={6} className="p-6">
                        <OrderDetailsSection
                          order={order}
                          onUpdateOrderStatus={onUpdateOrderStatus}
                          onContactCustomer={onContactCustomer}
                          openDeleteDialog={openDeleteDialog}
                        />
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
          {orders.map((order) => {
            const expanded = expandedOrders.has(order.id);
            return (
              <Card key={order.id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-sm truncate">{order.customer_name}</div>
                      <Badge variant="secondary" className="text-xs shrink-0">{getStatusLabel(order.status)}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {order.total_amount} د.م • {formatOrderDate(order)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleOrderDetails(order.id)}
                    className="shrink-0 h-8 w-8 p-0"
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Product Preview - Only show when collapsed */}
                {!expanded && Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex -space-x-1">
                      {order.items.slice(0, 3).map((item: OrderItem, index: number) => {
                        const src = item.image_url || item.image || item.image_urls?.[0] || '';
                        return (
                          <img
                            key={index}
                            src={src}
                            alt={item.name || 'product'}
                            className="h-6 w-6 rounded object-cover border bg-white"
                          />
                        );
                      })}
                    </div>
                    <span className="truncate">{order.items.length} منتج</span>
                  </div>
                )}

                {expanded && (
                  <div className="space-y-3 pt-2 border-t">
                    {/* Contact Info */}
                    <div className="space-y-1 text-xs">
                      {order.customer_phone && <div>📱 {order.customer_phone}</div>}
                      {order.customer_email && <div>✉️ {order.customer_email}</div>}
                      {order.city && <div>📍 {order.city}</div>}
                      {order.customer_address && <div className="text-muted-foreground">العنوان: {order.customer_address}</div>}
                    </div>
                    
                    {/* Products */}
                    <div>
                      <div className="text-xs font-semibold mb-2">المنتجات:</div>
                      <div className="space-y-2">
                        {order.items?.map((item: OrderItem, idx: number) => {
                          const img = item.image_url || item.image || item.image_urls?.[0] || '';
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={img}
                                alt={item.name}
                                className="h-10 w-10 rounded object-cover bg-white border shrink-0"
                              />
                              <div className="flex-1 min-w-0 text-xs">
                                <div className="font-medium truncate">{item.name}</div>
                                <div className="text-muted-foreground">x{item.quantity} • {item.price * item.quantity} د.م</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t">
                      <Select value={order.status} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                        <SelectTrigger className="h-9 text-sm">
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onContactCustomer(order)}
                          className="flex-1 h-9"
                        >
                          <MessageCircle className="h-4 w-4 text-green-600 mr-2" />
                          واتساب
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            openDeleteDialog({
                              type: 'order',
                              id: order.id,
                              name: order.customer_name,
                              meta: order.customer_phone,
                            })
                          }
                          className="h-9 px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
          {orders.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">لا توجد طلبات حالياً.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
