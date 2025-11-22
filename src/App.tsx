import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";

const queryClient = new QueryClient();

const App = () => {
  const config = useConfig();
  useEffect(() => {
    const title = config.basic?.seo?.title || config.basic?.app_name;
    if (title) document.title = title;
    const desc = config.basic?.seo?.description;
    if (desc) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', 'description');
        document.head.appendChild(el);
      }
      el.setAttribute('content', desc);
    }
    const keywords = config.basic?.seo?.keywords;
    if (keywords) {
      let el = document.querySelector('meta[name="keywords"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', 'keywords');
        document.head.appendChild(el);
      }
      el.setAttribute('content', keywords);
    }
  }, [config.basic?.seo?.title, config.basic?.app_name, config.basic?.seo?.description, config.basic?.seo?.keywords]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
