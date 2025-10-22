import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    about: [
      { name: "عن المتجر", href: "#" },
      { name: "طرق الدفع", href: "#" },
      { name: "الشحن والتسليم", href: "#" },
    ],
    policies: [
      { name: "شروط الاستخدام", href: "#" },
      { name: "سياسة الاستبدال", href: "#" },
      { name: "سياسة الخصوصية", href: "#" },
    ],
    contact: [
      { name: "اتصل بنا", href: "#" },
      { name: "الأسئلة المتكررة", href: "#" },
    ],
  };

  return (
    <footer className="bg-background text-foreground mt-20">
      {/* Decorative Separator */}
      <div className="container mx-auto px-4 mb-8">
        <div className="relative py-8">
          {/* Main gradient line */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          </div>
          {/* Center decorative element */}
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-8 py-2 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Double line separator */}
        <div className="space-y-2">
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="border-t border-border/50">
      {/* Social Section */}
      <div className="border-b border-amber-500/20 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            تابعنا على مواقع التواصل
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          {/* About */}
          <div>
            <h4 className="text-amber-600 font-bold text-lg mb-4">عن متجرنا</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-amber-600 transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-amber-600 font-bold text-lg mb-4">الشروط والسياسات</h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-amber-600 transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-600 font-bold text-lg mb-4">اتصل بنا</h4>
            <ul className="space-y-2">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-amber-600 transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="text-center mt-12 pt-8 border-t border-amber-500/20">
          <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-2">
            و
          </div>
          <p className="text-sm text-foreground/70">
            © 2024 متجر العطور الفاخرة. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
      </div> {/* Close Footer Content wrapper */}
    </footer>
  );
};

export default Footer;
