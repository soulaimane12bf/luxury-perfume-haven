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
      ? 'grid grid-cols-1 gap-3 text-sm'
      : showManagementControls
        ? 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'
        : 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm';

  const isMobile = layout === 'mobile';

  return (
    <div className={isMobile ? "space-y-3" : "space-y-4"}>
      <div className={gridClasses}>
        <div>
          <h4 className={`font-semibold mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>تفاصيل العميل</h4>
          <div className={`space-y-1 ${isMobile ? 'text-[11px]' : 'text-xs'}`}>
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
          <h4 className={`font-semibold mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>المنتجات</h4>
          <div className="space-y-2">
            {Array.isArray(order.items) &&
              order.items.map((item: OrderItem, idx: number) => {
                const img = item.image_url || item.image || item.image_urls?.[0] || '';
                return (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={img}
                        alt={item.name}
                        className={`rounded object-cover flex-shrink-0 border ${isMobile ? 'h-10 w-10' : 'h-12 w-12 bg-white'}`}
                      />
                      <div className="min-w-0">
                        <div className={`font-medium truncate ${isMobile ? 'text-[11px]' : ''}`}>{item.name}</div>
                        {item.variant && (
                          <div className={`text-xs truncate ${isMobile ? 'text-[10px] text-muted-foreground' : 'text-muted-foreground'}`}>{item.variant}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`${isMobile ? 'text-[10px] text-muted-foreground' : 'text-sm'}`}>x{item.quantity}</div>
                      <div className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{item.price * item.quantity} <span className="text-[10px]">درهم</span></div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={`mt-2 pt-2 ${isMobile ? 'border-t border-amber-900/30' : 'border-t'}`}>
            <div className={`flex justify-between font-bold ${isMobile ? 'text-xs text-amber-400' : 'text-sm'}`}>
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
          <h4 className={`font-semibold mb-1 ${isMobile ? 'text-xs text-amber-400' : 'text-sm'}`}>ملاحظات:</h4>
          <p className={`${isMobile ? 'text-[11px] text-zinc-300' : 'text-xs text-muted-foreground'}`}>{order.notes}</p>
        </div>
      )}
      {!isMobile && <div className="text-xs text-muted-foreground">التاريخ: {formatOrderDate(order)}</div>}
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
    <Card className="shadow-sm">
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
                                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs ml-1 border">
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
                    <TableCell className="font-bold">{order.total_amount} درهم</TableCell>
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
              <Card key={order.id} className="overflow-hidden border bg-white shadow-sm">
                {/* Header Section - Compact */}
                <div className="bg-muted/50 p-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] font-mono text-muted-foreground">#{order.id.slice(0, 8)}</div>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onToggleOrderDetails(order.id)}
                      aria-label={expanded ? 'إخفاء تفاصيل الطلب' : 'عرض تفاصيل الطلب'}
                    >
                      {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                {/* Main Info - Compact Grid */}
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-0.5">العميل</div>
                      <div className="font-medium text-sm">{order.customer_name}</div>
                      {order.customer_phone && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">{order.customer_phone}</div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-muted-foreground mb-0.5">المبلغ</div>
                      <div className="font-bold text-lg">{order.total_amount} <span className="text-xs">درهم</span></div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{formatOrderDate(order)}</div>
                    </div>
                  </div>

                  {/* Quick Actions - Horizontal */}
                  <div className="flex gap-2 pt-2">
                    <Select value={order.status} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                      <SelectTrigger className="flex-1 h-8 text-xs">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-3"
                      onClick={() => onContactCustomer(order)}
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-green-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3"
                      onClick={() =>
                        openDeleteDialog({
                          type: 'order',
                          id: order.id,
                          name: order.customer_name,
                          meta: order.customer_phone,
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded && (
                  <div className="border-t bg-muted/30 p-3">
                    <OrderDetailsSection
                      order={order}
                      onUpdateOrderStatus={onUpdateOrderStatus}
                      onContactCustomer={onContactCustomer}
                      openDeleteDialog={openDeleteDialog}
                      showManagementControls={false}
                      layout="mobile"
                    />
                  </div>
                )}
              </Card>
            );
          })}
          {orders.length === 0 && (
            <div className="py-8 text-center text-sm text-amber-500/50">لا توجد طلبات حالياً.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}