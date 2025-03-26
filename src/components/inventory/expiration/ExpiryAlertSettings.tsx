
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const ExpiryAlertSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    earlyWarningDays: 30,
    criticalWarningDays: 7,
    emailNotifications: true,
    systemNotifications: true,
    dailyDigest: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving expiry alert settings:', settings);
    toast.success('Paramètres d\'alerte mis à jour');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="earlyWarningDays">Alerte anticipée (jours)</Label>
                <Input
                  id="earlyWarningDays"
                  name="earlyWarningDays"
                  type="number"
                  min="1"
                  value={settings.earlyWarningDays}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Nombre de jours avant expiration pour afficher une alerte jaune
                </p>
              </div>
              
              <div>
                <Label htmlFor="criticalWarningDays">Alerte critique (jours)</Label>
                <Input
                  id="criticalWarningDays"
                  name="criticalWarningDays"
                  type="number"
                  min="1"
                  value={settings.criticalWarningDays}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Nombre de jours avant expiration pour afficher une alerte rouge
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des alertes d'expiration par email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="systemNotifications">Notifications système</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher les alertes d'expiration dans le centre de notifications
                  </p>
                </div>
                <Switch
                  id="systemNotifications"
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("systemNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyDigest">Rapport quotidien</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé quotidien des lots expirants
                  </p>
                </div>
                <Switch
                  id="dailyDigest"
                  checked={settings.dailyDigest}
                  onCheckedChange={(checked) => handleSwitchChange("dailyDigest", checked)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-6">
              Enregistrer les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ExpiryAlertSettings;
