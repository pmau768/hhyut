import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearStorage } from "@/lib/services/storage";
import { useToast } from "@/hooks/use-toast";

interface SignOutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const SignOutButton = ({ 
  variant = "ghost", 
  size = "default",
  className = ""
}: SignOutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // Clear all storage data
      clearStorage();
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      // Navigate to sign in page
      navigate("/signin");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
};

export default SignOutButton; 