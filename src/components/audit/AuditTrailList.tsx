
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  User, 
  Eye, 
  Settings,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

type ModuleType = "inventory" | "sales" | "settings" | "users" | "register" | "security";
type ActionType = "create" | "update" | "delete" | "view" | "login" | "logout" | "export" | "approve" | "reject";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
  module: ModuleType;
  action: ActionType;
  details: string;
  metadata?: Record<string, any>;
}

const mockAuditEntries: AuditEntry[] = [
  {
    id: "AUD-0001",
    timestamp: "2023-12-20T10:15:22",
    user: {
      id: "U1",
      name: "John Admin",
      role: "admin"
    },
    module: "inventory",
    action: "update",
    details: "Updated price for product 'iPhone 15 Pro' from $999.99 to $949.99",
    metadata: {
      productId: "1",
      oldPrice: 999.99,
      newPrice: 949.99,
      reason: "Holiday discount"
    }
  },
  {
    id: "AUD-0002",
    timestamp: "2023-12-20T09:30:05",
    user: {
      id: "U2",
      name: "Jane Cashier",
      role: "cashier"
    },
    module: "sales",
    action: "create",
    details: "Created new sale #S-2023-042 for $1,549.97"
  },
  {
    id: "AUD-0003",
    timestamp: "2023-12-20T09:15:30",
    user: {
      id: "U2",
      name: "Jane Cashier",
      role: "cashier"
    },
    module: "register",
    action: "create",
    details: "Started shift with opening balance $200.00"
  },
  {
    id: "AUD-0004",
    timestamp: "2023-12-19T18:45:12",
    user: {
      id: "U1",
      name: "John Admin",
      role: "admin"
    },
    module: "settings",
    action: "update",
    details: "Updated store hours for Location 'Main Store'"
  },
  {
    id: "AUD-0005",
    timestamp: "2023-12-19T17:30:00",
    user: {
      id: "U3",
      name: "Mike Manager",
      role: "manager"
    },
    module: "inventory",
    action: "create",
    details: "Created purchase order #PO-2023-105 for supplier 'Apple Inc'"
  },
  {
    id: "AUD-0006",
    timestamp: "2023-12-19T16:22:54",
    user: {
      id: "U1",
      name: "John Admin",
      role: "admin"
    },
    module: "users",
    action: "create",
    details: "Created new user 'Emily Johnson' with role 'cashier'"
  },
  {
    id: "AUD-0007",
    timestamp: "2023-12-19T15:10:33",
    user: {
      id: "U3",
      name: "Mike Manager",
      role: "manager"
    },
    module: "inventory",
    action: "approve",
    details: "Approved stock adjustment #ADJ-2023-022"
  },
  {
    id: "AUD-0008",
    timestamp: "2023-12-19T14:05:19",
    user: {
      id: "U2",
      name: "Jane Cashier",
      role: "cashier"
    },
    module: "register",
    action: "update",
    details: "Ended shift with closing balance $1,150.50"
  },
  {
    id: "AUD-0009",
    timestamp: "2023-12-19T11:45:02",
    user: {
      id: "U3",
      name: "Mike Manager",
      role: "manager"
    },
    module: "security",
    action: "export",
    details: "Exported transaction report for December 1-15, 2023"
  },
  {
    id: "AUD-0010",
    timestamp: "2023-12-19T09:00:12",
    user: {
      id: "U1",
      name: "John Admin",
      role: "admin"
    },
    module: "security",
    action: "login",
    details: "Login from IP 192.168.1.105"
  }
];

const AuditTrailList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter audit entries based on search and filters
  const filteredEntries = mockAuditEntries.filter(entry => {
    const matchesSearch = 
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesModule = selectedModule === "all" || entry.module === selectedModule;
    const matchesAction = selectedAction === "all" || entry.action === selectedAction;
    const matchesUser = selectedUser === "all" || entry.user.id === selectedUser;
    
    return matchesSearch && matchesModule && matchesAction && matchesUser;
  });
  
  // Get unique users for the filter
  const users = Array.from(new Set(mockAuditEntries.map(entry => entry.user.id)))
    .map(userId => {
      const user = mockAuditEntries.find(entry => entry.user.id === userId)?.user;
      return user ? { id: user.id, name: user.name } : null;
    })
    .filter(Boolean) as { id: string, name: string }[];
  
  const handleViewDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setIsDetailsModalOpen(true);
  };
  
  const getModuleIcon = (module: ModuleType) => {
    switch (module) {
      case "inventory":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "sales":
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case "settings":
        return <Settings className="h-4 w-4 text-amber-600" />;
      case "users":
        return <Users className="h-4 w-4 text-purple-600" />;
      case "register":
        return <ShoppingCart className="h-4 w-4 text-cyan-600" />;
      case "security":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };
  
  const getActionBadge = (action: ActionType) => {
    switch (action) {
      case "create":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Create</Badge>;
      case "update":
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Update</Badge>;
      case "delete":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Delete</Badge>;
      case "view":
        return <Badge className="bg-gray-500/20 text-gray-600 hover:bg-gray-500/30">View</Badge>;
      case "login":
        return <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">Login</Badge>;
      case "logout":
        return <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">Logout</Badge>;
      case "export":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Export</Badge>;
      case "approve":
        return <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">Approve</Badge>;
      case "reject":
        return <Badge className="bg-rose-500/20 text-rose-600 hover:bg-rose-500/30">Reject</Badge>;
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit trail..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="register">Register</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="view">View</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle>Audit Trail</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-full">Details</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(entry.timestamp)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{entry.user.name}</span>
                      <span className="text-xs text-muted-foreground">{entry.user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getModuleIcon(entry.module)}
                      <span className="capitalize">{entry.module}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getActionBadge(entry.action)}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewDetails(entry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No audit entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Audit Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Entry ID</h4>
                  <p>{selectedEntry.id}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Timestamp</h4>
                  <p>{formatDate(selectedEntry.timestamp)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">User</h4>
                  <p>{selectedEntry.user.name} ({selectedEntry.user.role})</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Module</h4>
                  <div className="flex items-center gap-2">
                    {getModuleIcon(selectedEntry.module)}
                    <span className="capitalize">{selectedEntry.module}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Action</h4>
                  {getActionBadge(selectedEntry.action)}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Details</h4>
                <p className="mt-1">{selectedEntry.details}</p>
              </div>
              
              {selectedEntry.metadata && (
                <div>
                  <h4 className="font-medium text-sm">Additional Data</h4>
                  <div className="bg-muted rounded-md p-3 mt-1">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(selectedEntry.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditTrailList;
