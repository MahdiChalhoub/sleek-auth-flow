
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  notificationSettings: {
    inventory: boolean;
    shift: boolean;
    approval: boolean;
    system: boolean;
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  setNotificationSettings: React.Dispatch<React.SetStateAction<{
    inventory: boolean;
    shift: boolean;
    approval: boolean;
    system: boolean;
    email: boolean;
    push: boolean;
    desktop: boolean;
  }>>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  notificationSettings,
  setNotificationSettings
}) => {
  const { toast } = useToast();

  const handleToggleNotificationType = (type: 'inventory' | 'shift' | 'approval' | 'system') => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    // Use static strings instead of functions for toast title
    const isCurrentlyEnabled = notificationSettings[type];
    toast({
      title: isCurrentlyEnabled ? "Notifications désactivées" : "Notifications activées",
      description: `Les notifications de type ${type} ont été ${isCurrentlyEnabled ? "désactivées" : "activées"}`,
    });
  };

  const handleToggleNotificationChannel = (channel: 'email' | 'push' | 'desktop') => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
    
    // Use static strings instead of functions for toast title
    const isCurrentlyEnabled = notificationSettings[channel];
    toast({
      title: isCurrentlyEnabled ? "Canal désactivé" : "Canal activé",
      description: `Les notifications par ${channel} ont été ${isCurrentlyEnabled ? "désactivées" : "activées"}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Types de notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span>Inventaire</span>
            </div>
            <Switch 
              checked={notificationSettings.inventory} 
              onCheckedChange={() => handleToggleNotificationType('inventory')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Sessions</span>
            </div>
            <Switch 
              checked={notificationSettings.shift} 
              onCheckedChange={() => handleToggleNotificationType('shift')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-amber-500" />
              <span>Approbations</span>
            </div>
            <Switch 
              checked={notificationSettings.approval} 
              onCheckedChange={() => handleToggleNotificationType('approval')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-purple-500" />
              <span>Système</span>
            </div>
            <Switch 
              checked={notificationSettings.system} 
              onCheckedChange={() => handleToggleNotificationType('system')}
            />
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">Canaux de notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span>Notifications par email</span>
              <p className="text-xs text-muted-foreground">Recevez des notifications par email</p>
            </div>
            <Switch 
              checked={notificationSettings.email} 
              onCheckedChange={() => handleToggleNotificationChannel('email')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span>Notifications push</span>
              <p className="text-xs text-muted-foreground">Recevez des notifications push sur mobile</p>
            </div>
            <Switch 
              checked={notificationSettings.push} 
              onCheckedChange={() => handleToggleNotificationChannel('push')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span>Notifications desktop</span>
              <p className="text-xs text-muted-foreground">Recevez des notifications sur votre navigateur</p>
            </div>
            <Switch 
              checked={notificationSettings.desktop} 
              onCheckedChange={() => handleToggleNotificationChannel('desktop')}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <Button className="w-full">Enregistrer les préférences</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
