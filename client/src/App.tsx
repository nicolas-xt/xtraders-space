import { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, getRedirectResult } from "firebase/auth";
import type { User } from "firebase/auth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result from Google sign-in
    console.log("🔄 Checking for redirect result...");
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("✅ Sign-in successful!");
          console.log("User:", result.user.displayName);
          console.log("Email:", result.user.email);
        } else {
          console.log("ℹ️ No redirect result (normal page load)");
        }
      })
      .catch((error) => {
        console.group("❌ ERRO COMPLETO NO REDIRECT");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error name:", error.name);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        console.error("Current domain:", window.location.hostname);
        console.error("Current URL:", window.location.href);
        console.error("Auth domain configured:", auth.config.authDomain);
        console.error("Firebase config:", {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "Present" : "Missing",
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID ? "Present" : "Missing"
        });
        console.groupEnd();
        
        // Show user-friendly error based on code
        let errorMsg = `Erro no login do Google!\n\n`;
        errorMsg += `Código: ${error.code || 'UNKNOWN'}\n`;
        errorMsg += `Mensagem: ${error.message}\n`;
        errorMsg += `Domínio atual: ${window.location.hostname}\n\n`;
        
        if (error.code === "auth/unauthorized-domain") {
          errorMsg += `❌ Este domínio NÃO está autorizado!\n\n`;
          errorMsg += `Solução:\n`;
          errorMsg += `1. Vá em Firebase Console\n`;
          errorMsg += `2. Authentication → Settings → Authorized domains\n`;
          errorMsg += `3. Adicione: ${window.location.hostname}`;
        } else if (error.code === "auth/operation-not-allowed") {
          errorMsg += `❌ Provedor Google não habilitado!\n\n`;
          errorMsg += `Solução:\n`;
          errorMsg += `1. Vá em Firebase Console\n`;
          errorMsg += `2. Authentication → Sign-in method\n`;
          errorMsg += `3. Ative o provedor Google`;
        } else if (error.code === "auth/invalid-api-key") {
          errorMsg += `❌ API Key inválida!\n\n`;
          errorMsg += `Verifique os Secrets do Replit.`;
        } else if (!error.code) {
          errorMsg += `⚠️ Erro sem código específico.\n`;
          errorMsg += `Verifique o console do navegador para mais detalhes.`;
        }
        
        alert(errorMsg);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Auth state: User signed in");
        console.log("User:", user.displayName, user.email);
      } else {
        console.log("ℹ️ Auth state: No user");
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {user ? <Dashboard /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
