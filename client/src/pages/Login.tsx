import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
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
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Login successful:", result.user.email);
    } catch (error: any) {
      console.error("❌ Login error:", error.code, error.message);
      setIsLoading(false);
      
      let errorMessage = "Falha ao fazer login com Google";
      let errorDetails = error.message;
      
      if (error.code === "auth/configuration-not-found") {
        errorMessage = "Configuração OAuth não encontrada";
        errorDetails = "O provedor Google não está configurado no Firebase Console. Siga estas etapas:\n1. Acesse Firebase Console\n2. Authentication → Sign-in method\n3. Ative o provedor Google\n4. Adicione este domínio aos domínios autorizados";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up bloqueado";
        errorDetails = "Por favor, permita pop-ups para este site.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage = "Domínio não autorizado";
        errorDetails = `Adicione '${window.location.hostname}' aos domínios autorizados no Firebase Console.`;
      } else if (error.code === "auth/invalid-api-key") {
        errorMessage = "API Key inválida";
        errorDetails = "Verifique se VITE_FIREBASE_API_KEY está configurado corretamente nos Secrets.";
      }
      
      toast({
        title: errorMessage,
        description: errorDetails,
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
