import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/models/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, MapPin, Mail, Phone, Tag, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ client }) => {
  const navigate = useNavigate();
  
  const handleEditClient = () => {
    navigate(`/clients/${client.id}/edit`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{client.name}</CardTitle>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
              {client.status || 'Active'}
            </Badge>
            <Badge variant={client.type === 'vip' ? 'destructive' : 'outline'}>
              {client.type === 'vip' ? 'VIP' : client.type || 'Regular'}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleEditClient}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-3">
            {client.email && (
              <div className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm">{client.email}</p>
                </div>
              </div>
            )}
            
            {client.phone && (
              <div className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm">{client.phone}</p>
                </div>
              </div>
            )}
            
            {client.address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm">{client.address}</p>
                  {(client.city || client.country) && (
                    <p className="text-sm">
                      {client.city}{client.city && client.country ? ', ' : ''}{client.country}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Information */}
          <div className="space-y-3">
            {client.createdAt && (
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Client Since</p>
                  <p className="text-sm">{format(new Date(client.createdAt), 'PP')}</p>
                </div>
              </div>
            )}
            
            {client.tags && client.tags.length > 0 && (
              <div className="flex items-start">
                <Tag className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {client.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {client.lastVisit && (
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Visit</p>
                  <p className="text-sm">{format(new Date(client.lastVisit), 'PP')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Notes Section */}
        {client.notes && (
          <div className="pt-2">
            <div className="flex items-start mb-1">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm font-medium">Notes</p>
            </div>
            <p className="text-sm bg-muted p-3 rounded-md">{client.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
