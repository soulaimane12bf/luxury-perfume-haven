import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages with chunk-retry support
const ProductSingle = lazyWithRetry(() => import("./pages/ProductSingle"), 'ProductSingle');
const Collection = lazyWithRetry(() => import("./pages/Collection"), 'Collection');
const BestSellers = lazyWithRetry(() => import("./pages/BestSellers"), 'BestSellers');
const Admin = lazyWithRetry(() => import("./pages/AdminNew"), 'AdminNew');
const Login = lazyWithRetry(() => import("./pages/Login"), 'Login');
const ForgotPassword = lazyWithRetry(() => import("./pages/ForgotPassword"), 'ForgotPassword');
const ResetPassword = lazyWithRetry(() => import("./pages/ResetPassword"), 'ResetPassword');
const About = lazyWithRetry(() => import("./pages/About"), 'About');
const Payment = lazyWithRetry(() => import("./pages/Payment"), 'Payment');
const Shipping = lazyWithRetry(() => import("./pages/Shipping"), 'Shipping');
const Terms = lazyWithRetry(() => import("./pages/Terms"), 'Terms');
const Refunds = lazyWithRetry(() => import("./pages/Refunds"), 'Refunds');
const Privacy = lazyWithRetry(() => import("./pages/Privacy"), 'Privacy');
const Contact = lazyWithRetry(() => import("./pages/Contact"), 'Contact');
const Faq = lazyWithRetry(() => import("./pages/Faq"), 'Faq');
const ProtectedRoute = lazyWithRetry(() => import("@/components/ProtectedRoute"), 'ProtectedRoute');

const queryClient = new QueryClient();

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
      <p className="text-lg text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <CartDrawer />
          <BrowserRouter>
            {/* Only show the WhatsApp floating bubble on routes other than /forgot-password */}
            {/* Define a small component inside the Router so it can access `useLocation()` */}
            {
              (() => {
                const FloatingWhatsAppConditional = () => {
                  // `useLocation` must be used inside the Router; define here so
                  // the hook is available at render time.
                  const location = useLocation();
                  // Hide the bubble on the forgot-password and reset-password screens
                  if (location.pathname === '/forgot-password' || location.pathname === '/reset-password') return null;
                  return <FloatingWhatsApp />;
                };
                return <FloatingWhatsAppConditional />;
              })()
            }
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductSingle />} />
                <Route path="/collection/:category" element={<Collection />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/about" element={<About />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/refunds" element={<Refunds />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
