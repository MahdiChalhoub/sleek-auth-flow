
import React from 'react';
import { Business } from '@/models/interfaces/businessInterfaces';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Trash2,
  Power,
  PowerOff
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export interface BusinessCardProps {
  business: Business;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDeleteBusiness: () => void;
  onToggleStatus: (isActive: boolean) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isExpanded,
  onToggleExpand,
  onDeleteBusiness,
  onToggleStatus
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDeleteBusiness();
    setIsDeleteDialogOpen(false);
  };

  const isActive = business.status === 'active' || business.active;

  return (
    <Card className="shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <span className="font-medium">{business.name}</span>
            <Badge variant={isActive ? "success" : "destructive"} className="ml-2">
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleStatus(!isActive)}
              className={`h-8 w-8 p-0 ${isActive ? 'text-destructive hover:text-destructive/80' : 'text-success hover:text-success/80'}`}
            >
              {isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.email || 'No email'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.phone || 'No phone'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.address || 'No address'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{business.country || 'No country'}</span>
            </div>
          </div>
          {business.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{business.description}</p>
            </div>
          )}
        </CardContent>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the business "{business.name}" and all its associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
