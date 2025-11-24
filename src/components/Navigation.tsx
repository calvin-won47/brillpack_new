import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const config = useConfig();
  const navCopy = config.extra?.nav;

  const navItems = [
    { name: navCopy?.home || "Home", href: "#home" },
    { name: navCopy?.about || "About", href: "#about" },
    { name: navCopy?.services || "Services", href: "#services" },
    { name: navCopy?.products || "Products", href: "#products" },
    { name: navCopy?.contact || "Contact", href: "#contact" },
    { name: navCopy?.blog || "Blog", href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#home" className="text-2xl font-bold">
              {config.basic?.app_name || "BrillPack"}
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith("/") ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:text-accent transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="hover:text-accent transition-colors font-medium"
                >
                  {item.name}
                </a>
              )
            ))}
          <Button variant="hero" size="default">
            {navCopy?.quickQuote || "Quick Quote"}
          </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              item.href.startsWith("/") ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              )
            ))}
            <Button variant="hero" size="default" className="w-full mt-4">
              Quick Quote
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
