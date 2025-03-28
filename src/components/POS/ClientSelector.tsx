import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, UserPlus, Star, CreditCard, Phone, Mail, MapPin, AlertCircle, Clock } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/models/client";

// Create mock clients here directly instead of importing them
const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    type: "regular",
    status: "active",
    isVip: false,
    credit_limit: 1000,
    outstanding_balance: 250,
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    type: "vip",
    status: "active",
    isVip: true,
    credit_limit: 5000,
    outstanding_balance: 750,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 333-2222",
    address: "789 Pine St, Elsewhere, USA",
    type: "credit",
    status: "active",
    isVip: false,
    credit_limit: 3000,
    outstanding_balance: 3000, // Credit limit reached
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 444-5555",
    address: "101 Elm St, Nowhere, USA",
    type: "wholesale",
    status: "active",
    isVip: true,
    credit_limit: 10000,
    outstanding_balance: 2500,
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Split component into smaller parts
interface ClientSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (clientName: string) => void;
}

// Schema for new client form
const newClientSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal("")),
  phone: z.string().min(5, { message: "Phone number is required" }),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type NewClientFormValues = z.infer<typeof newClientSchema>;

// Client Item Component
const ClientItem = ({ client, onSelect, isBlocked }: { 
  client: Client, 
  onSelect: (name: string) => void,
  isBlocked: boolean 
}) => {
  return (
    <Button
      key={client.id}
      variant="outline"
      className="w-full justify-start h-auto py-3"
      onClick={() => onSelect(client.name)}
      disabled={isBlocked}
    >
      <div className="flex items-center w-full">
        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center">
            <p className="font-medium">{client.name}</p>
            <div className="ml-2 flex gap-1">
              {client.isVip && (
                <span className="inline-flex">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </span>
              )}
              {isBlocked && (
                <span className="inline-flex">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {client.email} • {client.phone}
          </p>
          {client.lastVisit && (
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last visit: {new Date(client.lastVisit).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {client.credit_limit !== undefined && (
          <div className="text-right text-xs">
            <div className="flex items-center justify-end gap-1">
              <CreditCard className="h-3 w-3" />
              <span>${client.credit_limit}</span>
            </div>
            <p className="text-muted-foreground">
              Balance: ${client.outstanding_balance || 0}
            </p>
            {isBlocked && (
              <p className="text-red-500 text-xs">Account blocked</p>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};

// New Client Form Component
const NewClientForm = ({ onSubmit }: { onSubmit: (data: NewClientFormValues) => void }) => {
  const form = useForm<NewClientFormValues>({
    resolver: zodResolver(newClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="John Smith" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="+1 234 567 8901" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="john@example.com" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="123 Main St, City" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Customer preferences or special requirements" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Add any additional information about this client
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-2">
          <Button type="submit" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Client
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Client List Component
const ClientList = ({ 
  clients, 
  searchQuery, 
  onClientSelect 
}: { 
  clients: Client[], 
  searchQuery: string, 
  onClientSelect: (name: string) => void 
}) => {
  const [filteredClients, setFilteredClients] = useState(clients);
  
  // Update filtered clients when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        client => 
          client.name.toLowerCase().includes(query) || 
          client.email?.toLowerCase().includes(query) ||
          client.phone?.includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);
  
  // Check if client is blocked
  const isClientBlocked = (client: Client) => {
    return client.credit_limit !== undefined && 
           client.outstanding_balance !== undefined &&
           client.outstanding_balance >= client.credit_limit;
  };
  
  return (
    <div className="max-h-60 overflow-y-auto space-y-2">
      {filteredClients.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          <p>No clients found</p>
        </div>
      ) : (
        filteredClients.map(client => (
          <ClientItem 
            key={client.id}
            client={client} 
            onSelect={onClientSelect}
            isBlocked={isClientBlocked(client)}
          />
        ))
      )}
    </div>
  );
};

// Main ClientSelector Component
const ClientSelector = ({ isOpen, onClose, onSelect }: ClientSelectorProps) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setActiveTab('existing');
    }
  }, [isOpen]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  
  // Handle new client submission
  const onSubmit = (data: NewClientFormValues) => {
    // In a real app, you would add this client to the database
    onSelect(data.name);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Client Selection</DialogTitle>
          <DialogDescription>
            Select an existing client or create a new one
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'existing' | 'new')}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="existing">Existing Client</TabsTrigger>
            <TabsTrigger value="new">New Client</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="py-4">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search clients..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            
            {/* Client List */}
            <ClientList 
              clients={mockClients} 
              searchQuery={searchQuery} 
              onClientSelect={onSelect} 
            />
            
            {/* Guest Option */}
            <Button 
              variant="secondary" 
              className="w-full justify-start mt-3"
              onClick={() => onSelect("Guest")}
            >
              <User className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </TabsContent>
          
          <TabsContent value="new" className="py-4">
            <NewClientForm onSubmit={onSubmit} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelector;
