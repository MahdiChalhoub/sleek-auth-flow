
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { timezones } from '@/constants/timezones';

interface LocationData {
  name: string;
  type: string;
  address: string;
  timezone: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

interface LocationInfoFormProps {
  data: LocationData;
  onChange: (data: LocationData) => void;
}

const LocationInfoForm: React.FC<LocationInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof LocationData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        <p className="text-muted-foreground mb-6">
          Set up your primary business location where you'll operate your POS system.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="locationName">Location Name <span className="text-red-500">*</span></Label>
            <Input
              id="locationName"
              placeholder="e.g., Main Store, Headquarters, Downtown Branch"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type <span className="text-red-500">*</span></Label>
            <Select
              value={data.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger id="locationType">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail Store</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street address"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone number"
                value={data.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email address"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={data.timezone}
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="isDefault"
              checked={data.isDefault}
              onCheckedChange={(checked) => handleChange('isDefault', checked)}
            />
            <Label htmlFor="isDefault">Set as default location</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoForm;
