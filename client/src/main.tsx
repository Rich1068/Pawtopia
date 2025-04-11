import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import { FavoritesProvider } from "./context/FavoritesContext.tsx";
import { QueryClient } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext.tsx";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, //5 minutes
      gcTime: 1000 * 60 * 60 * 24, //24 hours
    },
  },
});

// Persist the query cache using local storage
const persister = createSyncStoragePersister({ storage: window.localStorage });

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            <App />
          </PersistQueryClientProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
  //</StrictMode>
);
