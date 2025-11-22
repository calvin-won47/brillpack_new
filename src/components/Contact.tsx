import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConfig } from "@/contexts/ConfigContext";

export const Contact = () => {
  const config = useConfig();
  const extra = config.extra?.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: extra?.toastTitle || "Quote Request Received!",
      description: extra?.toastDescription || "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-semibold mb-4">
            {extra?.badge || "Get In Touch"}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {extra?.heading || "Request Your Custom Quote"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {extra?.description || "Let's discuss how we can bring your packaging vision to life. Fill out the form below and we'll respond promptly."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {extra?.emailLabel || "Email Us"}
                </h3>
                <p className="text-muted-foreground">{extra?.email || "info@brillpack.com"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {extra?.phoneLabel || "Call Us"}
                </h3>
                <p className="text-muted-foreground">{extra?.phone || "+1 (555) 123-4567"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {extra?.addressLabel || "Visit Us"}
                </h3>
                <p className="text-muted-foreground">
                  {(extra?.address || ["123 Packaging Lane", "Business District, NY 10001"]).map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < (extra?.address?.length || 2) - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl shadow-lg border border-border">
            <div>
              <Input
                placeholder={extra?.placeholders?.name || "Your Name"}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder={extra?.placeholders?.email || "Your Email"}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder={extra?.placeholders?.phone || "Phone Number"}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Textarea
                placeholder={extra?.placeholders?.message || "Tell us about your packaging needs..."}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                required
              />
            </div>
            <Button type="submit" variant="default" size="lg" className="w-full">
              {extra?.submitText || "Send Quote Request"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
