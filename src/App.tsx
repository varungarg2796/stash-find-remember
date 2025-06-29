
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ItemsProvider } from "@/context/ItemsContext";
import { AuthProvider } from "@/context/AuthContext";
import { CollectionsProvider } from "@/context/CollectionsContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import MyStash from "./pages/MyStash";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ItemDetail from "./pages/ItemDetail";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Stats from "./pages/Stats";
import AskStasher from "./pages/AskStasher";
import Profile from "./pages/Profile";
import Archive from "./pages/Archive";
import BulkImport from "./pages/BulkImport";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import SharedCollection from "./pages/SharedCollection";
import CollectionNotFound from "./pages/CollectionNotFound";
import ItemNotFound from "./pages/ItemNotFound";
import AccessDenied from "./pages/AccessDenied";
import ServerError from "./pages/ServerError";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ItemsProvider>
            <CollectionsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/my-stash" element={<MyStash />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/items/:id" element={<ItemDetail />} />
                      <Route path="/add-item" element={<AddItem />} />
                      <Route path="/edit-item/:id" element={<EditItem />} />
                      <Route path="/stats" element={<Stats />} />
                      <Route path="/ask" element={<AskStasher />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/archive" element={<Archive />} />
                      <Route path="/bulk-import" element={<BulkImport />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/collections/:id" element={<CollectionDetail />} />
                      <Route path="/share/collection/:shareId" element={<SharedCollection />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />

                      {/* Error pages */}
                      <Route path="/error/collection-not-found" element={<CollectionNotFound />} />
                      <Route path="/error/item-not-found" element={<ItemNotFound />} />
                      <Route path="/error/access-denied" element={<AccessDenied />} />
                      <Route path="/error/server-error" element={<ServerError />} />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </BrowserRouter>
            </CollectionsProvider>
          </ItemsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
