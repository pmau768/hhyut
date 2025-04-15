import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFormData } from "@/lib/types";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual signin logic when adding Supabase
      console.log("Sign in data:", data);
      
      toast({
        title: "Signed in successfully!",
        description: "Welcome back to Dog Activity Tracker.",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;