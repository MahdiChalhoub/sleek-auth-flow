
import React from 'react';
import { Client } from '@/models/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Mail, MapPin, Phone, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface ClientInfoCardProps {
  client: Client;
}

export const ClientInfoCard: React.FC<ClientInfoCardProps> = ({ client }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Information</CardTitle>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{client.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {client.type}
                </Badge>
                {client.isVip && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    VIP
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h4>
              <ul className="space-y-2">
                {client.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </li>
                )}
                {client.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </li>
                )}
                {client.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{client.address}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Account Details</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Client Since:</span>
                  <span>{formatDate(client.createdAt)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span>{client.lastVisit ? formatDate(client.lastVisit) : 'N/A'}</span>
                </li>
                {client.salesRepId && (
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Sales Representative:</span>
                    <span>{client.salesRepId}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
