
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileDown, Calendar, Filter, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ip: string;
  status: "success" | "warning" | "error";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: "admin@example.com",
    action: "login",
    resource: "système",
    details: "Connexion réussie",
    timestamp: "2023-10-15T09:30:45",
    ip: "192.168.1.100",
    status: "success"
  },
  {
    id: "2",
    user: "manager@example.com",
    action: "create",
    resource: "produit",
    details: "Création du produit 'iPhone 15 Pro'",
    timestamp: "2023-10-15T10:15:20",
    ip: "192.168.1.101",
    status: "success"
  },
  {
    id: "3",
    user: "cashier@example.com",
    action: "update",
    resource: "transaction",
    details: "Modification de la transaction #TRX-2023-1015",
    timestamp: "2023-10-15T11:05:33",
    ip: "192.168.1.102",
    status: "warning"
  },
  {
    id: "4",
    user: "admin@example.com",
    action: "delete",
    resource: "client",
    details: "Suppression du client ID: CL-123",
    timestamp: "2023-10-15T13:45:10",
    ip: "192.168.1.100",
    status: "warning"
  },
  {
    id: "5",
    user: "cashier@example.com",
    action: "failed_login",
    resource: "système",
    details: "Tentative de connexion échouée",
    timestamp: "2023-10-14T08:15:22",
    ip: "192.168.1.105",
    status: "error"
  },
  {
    id: "6",
    user: "manager@example.com",
    action: "register_open",
    resource: "caisse",
    details: "Ouverture de la caisse #REG-001",
    timestamp: "2023-10-14T09:00:05",
    ip: "192.168.1.101",
    status: "success"
  },
  {
    id: "7",
    user: "admin@example.com",
    action: "configuration",
    resource: "paramètres",
    details: "Modification des paramètres de TVA",
    timestamp: "2023-10-13T16:30:45",
    ip: "192.168.1.100",
    status: "success"
  }
];

const UserActivity: React.FC = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "L'export des activités utilisateurs a été lancé"
    });
  };

  const filteredActivities = activities
    .filter(activity => 
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.ip.includes(searchTerm)
    )
    .filter(activity => 
      activeTab === "all" || 
      (activeTab === "success" && activity.status === "success") ||
      (activeTab === "warning" && activity.status === "warning") ||
      (activeTab === "error" && activity.status === "error")
    );

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: Activity["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Succès</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Attention</Badge>;
      case "error":
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return null;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "login": return "Connexion";
      case "create": return "Création";
      case "update": return "Modification";
      case "delete": return "Suppression";
      case "failed_login": return "Échec connexion";
      case "register_open": return "Ouverture caisse";
      case "configuration": return "Configuration";
      default: return action;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Activité Utilisateurs</CardTitle>
              <CardDescription>
                Suivez l'activité des utilisateurs sur votre système
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="success">Succès</TabsTrigger>
                <TabsTrigger value="warning">Attention</TabsTrigger>
                <TabsTrigger value="error">Erreurs</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] sm:w-[300px]"
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Ressource</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune activité trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="whitespace-nowrap">{formatDateTime(activity.timestamp)}</TableCell>
                          <TableCell>{activity.user}</TableCell>
                          <TableCell>{getActionText(activity.action)}</TableCell>
                          <TableCell>{activity.resource}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={activity.details}>
                            {activity.details}
                          </TableCell>
                          <TableCell>{activity.ip}</TableCell>
                          <TableCell>{getStatusBadge(activity.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="h-8">
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;
