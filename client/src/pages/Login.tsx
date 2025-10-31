import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Users } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in:", error);
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
            data-testid="button-google-signin"
          >
            <SiGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
