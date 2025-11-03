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
        console.error("❌ Redirect error:");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
        
        // Show user-friendly error based on code
        if (error.code === "auth/unauthorized-domain") {
          alert(`Domínio não autorizado!\n\nAdicione '${window.location.hostname}' aos domínios autorizados no Firebase Console:\n\n1. Vá em Authentication → Settings\n2. Adicione o domínio na lista de 'Authorized domains'`);
        } else if (error.code === "auth/operation-not-allowed") {
          alert("Provedor Google não está habilitado!\n\nHabilite no Firebase Console:\n\n1. Vá em Authentication → Sign-in method\n2. Ative o provedor Google");
        }
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
