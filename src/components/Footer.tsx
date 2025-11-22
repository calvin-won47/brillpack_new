import { useConfig } from "@/contexts/ConfigContext";

export const Footer = () => {
  const config = useConfig();
  const extra = config.extra?.footer;
  const brand = extra?.brand || config.basic?.app_name || "BrillPack";
  const tagline = extra?.tagline || "Brilliance in every box – creating custom packaging solutions that elevate your brand.";
  const quickLinks = extra?.quickLinks || [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "products", label: "Products" },
  ];
  const services = extra?.services || ["Custom Design", "Premium Finishes", "Brand Enhancement", "Fast Delivery"];
  const contact = extra?.contact || ["info@brillpack.com", "+1 (555) 123-4567", "123 Packaging Lane", "Business District, NY 10001"];
  const copyright = extra?.copyright || `© ${new Date().getFullYear()} ${brand}. All rights reserved. Elevating brands through innovative packaging solutions.`;
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{brand}</h3>
            <p className="text-primary-foreground/80">{tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{extra?.quickLinksLabel || "Quick Links"}</h4>
            <ul className="space-y-2">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <a href={`#${l.id || "home"}`} className="text-primary-foreground/80 hover:text-accent transition-colors">
                    {l.label || "Link"}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{extra?.servicesLabel || "Services"}</h4>
            <ul className="space-y-2">
              {services.map((s, i) => (
                <li key={i} className="text-primary-foreground/80">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{extra?.contactLabel || "Contact"}</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              {contact.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
