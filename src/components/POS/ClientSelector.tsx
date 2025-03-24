
import React, { useState } from "react";
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
import { Client, mockClients } from "@/models/client";

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

const ClientSelector = ({ isOpen, onClose, onSelect }: ClientSelectorProps) => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);
  
  // Form for new client
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
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setFilteredClients(mockClients);
      setActiveTab('existing');
      form.reset();
    }
  }, [isOpen, form]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredClients(mockClients);
    } else {
      const filtered = mockClients.filter(
        client => 
          client.name.toLowerCase().includes(query) || 
          client.email?.toLowerCase().includes(query) ||
          client.phone?.includes(query)
      );
      setFilteredClients(filtered);
    }
  };
  
  // Handle new client submission
  const onSubmit = (data: NewClientFormValues) => {
    // In a real app, you would add this client to the database
    onSelect(data.name);
  };
  
  // Check if client is blocked (for demonstration, we'll consider any client with outstandingBalance > creditLimit as blocked)
  const isClientBlocked = (client: Client) => {
    return client.creditLimit !== undefined && 
           client.outstandingBalance !== undefined &&
           client.outstandingBalance >= client.creditLimit;
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
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredClients.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p>No clients found</p>
                </div>
              ) : (
                filteredClients.map(client => (
                  <Button
                    key={client.id}
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                    onClick={() => onSelect(client.name)}
                    disabled={isClientBlocked(client)}
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
                            {isClientBlocked(client) && (
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
                      {client.creditLimit !== undefined && (
                        <div className="text-right text-xs">
                          <div className="flex items-center justify-end gap-1">
                            <CreditCard className="h-3 w-3" />
                            <span>${client.creditLimit}</span>
                          </div>
                          <p className="text-muted-foreground">
                            Balance: ${client.outstandingBalance || 0}
                          </p>
                          {isClientBlocked(client) && (
                            <p className="text-red-500 text-xs">Account blocked</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Button>
                ))
              )}
            </div>
            
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
