import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Records from "./pages/Records";
import Appointments from "./pages/Appointments";
import CalendarView from "./pages/CalendarView";
import Treatments from "./pages/Treatments";
import Doctors from "./pages/Doctors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="treatments" element={<Treatments />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="records" element={<Records />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
