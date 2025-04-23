
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientsFilters } from '@/components/clients/ClientsFilters';
import { useClientsData } from '@/hooks/useClientsData';
import { ClientLoadingSkeleton } from '@/components/clients/ClientLoadingSkeleton';

const ClientsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    clientType: 'all'
  });
  
  const { clients, isLoading, error } = useClientsData();
  
  // Filter clients based on search term and filters
  const filteredClients = clients?.filter(client => {
    // Search term filtering
    if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !client.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Client type filtering
    if (filters.clientType !== 'all') {
      if (filters.clientType === 'vip' && !client.isVip) return false;
      if (filters.clientType === 'regular' && client.type !== 'regular') return false;
      if (filters.clientType === 'credit' && client.type !== 'credit') return false;
      if (filters.clientType === 'wholesale' && client.type !== 'wholesale') return false;
    }
    
    return true;
  });
  
  const handleViewClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button onClick={() => navigate('/clients/new')}>
            <User className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Clients List</CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search clients by name or email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Button variant="outline" onClick={toggleFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {Object.values(filters).some(v => v !== 'all') && (
                    <Badge variant="secondary" className="ml-2">Active</Badge>
                  )}
                </Button>
              </div>
              
              {showFilters && (
                <ClientsFilters currentFilters={filters} onApplyFilters={applyFilters} />
              )}
              
              {isLoading ? (
                <ClientLoadingSkeleton type="list" />
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">An error occurred while loading clients.</p>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : (
                <ClientsTable 
                  clients={filteredClients || []} 
                  isLoading={false}
                  onViewClient={handleViewClient}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientsList;
