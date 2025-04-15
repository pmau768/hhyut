import { useState } from "react";
import { User, UserProfileFormData } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserProfileForm from "@/components/settings/UserProfileForm";
import NotificationSettings from "@/components/settings/NotificationSettings";

// Mock user data - replace with actual user data when adding backend
const mockUser: User = {
  id: "1",
  email: "john@example.com",
  name: "John Doe",
  imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  bio: "Dog lover and outdoor enthusiast",
  location: "New York, USA",
  website: "https://example.com",
  socialLinks: {
    twitter: "@johndoe",
    instagram: "@johndoe",
    facebook: "johndoe",
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    eventReminders: true,
    newsletterSubscription: false,
  },
  createdAt: new Date().toISOString(),
};

const Settings = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleProfileUpdate = async (data: UserProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual profile update logic when adding backend
      setUser((prev) => ({
        ...prev,
        ...data,
        updatedAt: new Date().toISOString(),
      }));

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [key]: value,
      },
    }));

    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    toast({
      title: "Are you sure?",
      description: "This action cannot be undone.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
            <UserProfileForm
              initialData={user}
              onSubmit={handleProfileUpdate}
              isLoading={isLoading}
            />
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            preferences={user.preferences!}
            onUpdate={handleNotificationUpdate}
          />
        </TabsContent>

        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Account Management</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-2">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your password to keep your account secure
                </p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div>
                <h3 className="text-base font-medium mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a copy of your data
                </p>
                <Button variant="outline">Export Data</Button>
              </div>

              <div>
                <h3 className="text-base font-medium text-destructive mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;