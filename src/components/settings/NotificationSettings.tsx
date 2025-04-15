import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Bell, Mail, Calendar, Newspaper } from "lucide-react";

interface NotificationSettingsProps {
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    eventReminders: boolean;
    newsletterSubscription: boolean;
  };
  onUpdate: (key: string, value: boolean) => void;
}

const NotificationSettings = ({ preferences, onUpdate }: NotificationSettingsProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="emailNotifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and notifications via email
              </p>
            </div>
          </div>
          <Switch
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) => onUpdate("emailNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="pushNotifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get instant updates in your browser
              </p>
            </div>
          </div>
          <Switch
            id="pushNotifications"
            checked={preferences.pushNotifications}
            onCheckedChange={(checked) => onUpdate("pushNotifications", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="eventReminders" className="font-medium">
                Event Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get reminders for upcoming events
              </p>
            </div>
          </div>
          <Switch
            id="eventReminders"
            checked={preferences.eventReminders}
            onCheckedChange={(checked) => onUpdate("eventReminders", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Newspaper className="w-5 h-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="newsletterSubscription" className="font-medium">
                Newsletter Subscription
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive our monthly newsletter
              </p>
            </div>
          </div>
          <Switch
            id="newsletterSubscription"
            checked={preferences.newsletterSubscription}
            onCheckedChange={(checked) => onUpdate("newsletterSubscription", checked)}
          />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;