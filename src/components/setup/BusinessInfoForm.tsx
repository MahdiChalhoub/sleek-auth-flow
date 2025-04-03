
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { currencies } from '@/constants/currencies';
import { countries } from '@/constants/countries';
import { businessTypes } from '@/constants/businessTypes';

interface BusinessData {
  name: string;
  type: string;
  currency: string;
  country: string;
  logoUrl: string;
  description: string;
}

interface BusinessInfoFormProps {
  data: BusinessData;
  onChange: (data: BusinessData) => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof BusinessData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Business Information</h2>
        <p className="text-muted-foreground mb-6">
          Tell us about your business. This information will be used throughout your POS system.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
            <Select
              value={data.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger id="businessType">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency <span className="text-red-500">*</span></Label>
              <Select
                value={data.currency}
                onValueChange={(value) => handleChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={data.country}
                onValueChange={(value) => handleChange('country', value)}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
            <Input
              id="logoUrl"
              placeholder="Enter logo URL"
              value={data.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter a URL to your logo image or leave blank to set later
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description of your business"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
