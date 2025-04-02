import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import AppLayout from "./Layout";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "@/components/ui/sonner"
import Database from "./pages/database";
import DatabaseLayout from "./DatabaseLayout";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route element={<DatabaseLayout />}>
            <Route path="/database" element={<Database />} />
          </Route>
        </Routes>
      </BrowserRouter>
       <Toaster />
    </ThemeProvider>
    </AppProvider>
  </React.StrictMode>
);
