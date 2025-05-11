
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemsProvider } from "@/context/ItemsContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Stats from "./pages/Stats";
import AskStasher from "./pages/AskStasher";
import Profile from "./pages/Profile";
import Archive from "./pages/Archive";
import BulkImport from "./pages/BulkImport";

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ItemsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/items/:id" element={<ItemDetail />} />
                      <Route path="/add-item" element={<AddItem />} />
                      <Route path="/edit-item/:id" element={<EditItem />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/ask" element={<AskStasher />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/archive" element={<Archive />} />
                      <Route path="/bulk-import" element={<BulkImport />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </ItemsProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
