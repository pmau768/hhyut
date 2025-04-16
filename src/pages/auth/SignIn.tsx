import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInFormData, User } from "@/lib/types";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
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
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account"
    >
      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />

      <div className="text-center space-y-4 mt-6">
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
    </AuthLayout>
  );
};

export default SignIn;