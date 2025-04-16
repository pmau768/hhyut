import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpFormData, User } from "@/lib/types";
import SignUpForm from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { setUser } from "@/lib/localStorage";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      // Create a new user object
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: data.email,
        name: data.name,
        createdAt: new Date().toISOString(),
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          eventReminders: true,
          newsletterSubscription: false
        }
      };
      
      // Save user to localStorage
      setUser(newUser);
      
      toast({
        title: "Account created successfully!",
        description: `Welcome to Woofer, ${data.name}!`,
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error creating account",
        description: "Please try again later.",
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
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2">
            Join our community of dog lovers
          </p>
        </div>

        <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;