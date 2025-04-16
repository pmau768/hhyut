import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFormData, User } from "@/lib/types";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUser, setUser } from "@/lib/localStorage";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll just check if the email matches the default user
      const user = getUser();
      
      // In a real app, we would check the password as well
      if (data.email !== user.email) {
        throw new Error("Invalid credentials");
      }
      
      // Update last login time
      const updatedUser: User = {
        ...user,
        updatedAt: new Date().toISOString()
      };
      
      // Save updated user to localStorage
      setUser(updatedUser);
      
      toast({
        title: "Signed in successfully!",
        description: `Welcome back, ${user.name}!`,
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