import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  cartItemCount: number;
  cartTotal: number;
  onCartClick: () => void;
}

const Header = ({ cartItemCount, cartTotal, onCartClick }: HeaderProps) => {
  const menuItems = [
    "الصفحة الرئيسية",
    "Coffret Cadeau",
    "عطور الرجال",
    "الأكثر مبيعا للرجال",
    "عطور النساء",
    "الأكثر مبيعا للنساء",
    "عطور أقل من 200 درهم",
    "ARMAF",
    "عطور الجسم ومزيل العرق",
    "الشعر والتجميل",
    "عينات العطور",
  ];

  return (
    <header className="sticky top-0 z-50 bg-background shadow-elegant">
      {/* Top Bar */}
      <div className="bg-primary py-2">
        <p className="text-center text-sm font-medium gradient-gold bg-clip-text text-transparent">
          التوصيل لجميع المدن ابتداء من 25 درهم فقط
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs text-accent-foreground flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* Center: Logo */}
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-gold bg-clip-text text-transparent">
              و
            </h1>
            <p className="text-xs text-muted-foreground">عطور فاخرة</p>
          </div>

          {/* Right: Search & Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {menuItems.map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="text-lg hover:text-gold transition-smooth py-2 border-b border-border"
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
