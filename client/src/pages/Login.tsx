import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Users } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google sign-in...");
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in:", error);
      setIsLoading(false);
      
      let errorMessage = "Falha ao fazer login com Google";
      
      if (error.code === "auth/configuration-not-found") {
        errorMessage = "Configuração OAuth não encontrada. Configure o Google no Firebase Console.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up bloqueado. Por favor, permita pop-ups para este site.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage = "Domínio não autorizado. Adicione este domínio no Firebase Console.";
      }
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">Work Hub</CardTitle>
            <CardDescription className="text-base">
              Sign in to see your team's presence and stay connected
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            size="lg"
            className="w-full gap-2"
            disabled={isLoading}
            data-testid="button-google-signin"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Redirecionando...
              </>
            ) : (
              <>
                <SiGoogle className="w-5 h-5" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
