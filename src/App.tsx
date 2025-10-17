import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductSingle from "./pages/ProductSingle";
import Collection from "./pages/Collection";
import BestSellers from "./pages/BestSellers";
import Admin from "./pages/AdminNew";
import Login from "./pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <CartDrawer />
          <FloatingWhatsApp />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductSingle />} />
              <Route path="/collection/:category" element={<Collection />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/login" element={<Login />} />
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
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
