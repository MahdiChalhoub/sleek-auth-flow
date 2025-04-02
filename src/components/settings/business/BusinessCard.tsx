
import React, { useState } from 'react';
import { Business } from '@/models/interfaces/businessInterfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Building2, MapPin, Phone, Mail, Calendar, Globe, Clock, Edit, Trash } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';

export interface BusinessCardProps {
  business: Business;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleStatus: (isActive: boolean) => void;
  onDeleteBusiness: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isExpanded,
  onToggleExpand,
  onToggleStatus,
  onDeleteBusiness
}) => {
  const { user } = useAuth();
  const isOwner = user?.id === business.ownerId;
  const [isActive, setIsActive] = useState(business.active ?? true);

  const handleStatusToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    onToggleStatus(newStatus);
  };

  return (
    <Card className="w-full transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-xl">{business.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={business.active ? "success" : "destructive"}>
              {business.active ? 'Active' : 'Inactive'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="p-0 h-8 w-8"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardDescription>{business.description || 'No description available'}</CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pb-2 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{business.address || 'No address'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{business.phone || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{business.email || 'No email'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Country: {business.country || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Timezone: {business.timezone || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDate(business.createdAt) || 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">Active</span>
              <Switch 
                checked={isActive} 
                onCheckedChange={handleStatusToggle}
                disabled={!isOwner} 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              {isOwner && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={onDeleteBusiness}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
