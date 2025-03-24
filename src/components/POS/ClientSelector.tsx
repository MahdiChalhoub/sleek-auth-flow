
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, UserPlus } from "lucide-react";

interface ClientSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (clientName: string) => void;
}

// Sample mock clients for demo
const mockClients = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+123456789" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+987654321" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "+192837465" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "+918273645" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", phone: "+567891234" },
];

const ClientSelector = ({ isOpen, onClose, onSelect }: ClientSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setFilteredClients(mockClients);
    }
  }, [isOpen]);
  
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
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query)
      );
      setFilteredClients(filtered);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Select Client</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
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
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email} • {client.phone}</p>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
          
          {/* Add New Client Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start mt-3"
            onClick={() => {
              // In a real app, you would show a form to add a new client
              onSelect("Guest");
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create New Client
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSelect("Guest")}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelector;
