import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { InitialLoader } from "@/components/threejs/InitialLoader";
import { DarkModeBackground } from "@/components/threejs/DarkModeBackground";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Features from "./pages/Features";
import MobileApp from "./pages/MobileApp";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Press from "./pages/Press";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardDiscover from "./pages/dashboard/DashboardDiscover";
import DashboardReservations from "./pages/dashboard/DashboardReservations";
import DashboardCharging from "./pages/dashboard/DashboardCharging";
import DashboardPayments from "./pages/dashboard/DashboardPayments";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import DashboardHelp from "./pages/dashboard/DashboardHelp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/app" element={<MobileApp />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/press" element={<Press />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="discover" element={<DashboardDiscover />} />
          <Route path="reservations" element={<DashboardReservations />} />
          <Route path="charging" element={<DashboardCharging />} />
          <Route path="payments" element={<DashboardPayments />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="help" element={<DashboardHelp />} />
          <Route path="*" element={<DashboardHome />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <InitialLoader />
      <DarkModeBackground />
      <div className="relative z-10">
        <AppContent />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
