
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Archive, Check, Clock, Database, Download, Eye, Key, Lock, Upload } from "lucide-react";
import { toast } from "sonner";

const BackupRestore = () => {
  const [backupType, setBackupType] = useState<string>("json");
  const [encryptBackup, setEncryptBackup] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [isBackupInProgress, setIsBackupInProgress] = useState<boolean>(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState<boolean>(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState<boolean>(false);
  const [selectedBackupForRestore, setSelectedBackupForRestore] = useState<string | null>(null);

  // Mock backup history data
  const backupHistory = [
    {
      id: "1",
      date: "2025-03-26 14:30:25",
      type: "JSON",
      size: "2.4 MB",
      createdBy: "Admin User",
      encrypted: true,
      stored: "Local"
    },
    {
      id: "2",
      date: "2025-03-25 09:15:10",
      type: "SQL",
      size: "3.1 MB",
      createdBy: "Admin User",
      encrypted: true,
      stored: "Cloud"
    },
    {
      id: "3",
      date: "2025-03-24 18:22:45",
      type: "JSON",
      size: "2.3 MB",
      createdBy: "Admin User",
      encrypted: true,
      stored: "Local"
    },
    {
      id: "4",
      date: "2025-03-23 11:05:33",
      type: "SQL",
      size: "3.0 MB",
      createdBy: "Admin User",
      encrypted: true,
      stored: "Cloud"
    }
  ];

  const handleCreateBackup = () => {
    if (encryptBackup && !password) {
      toast.error("Mot de passe requis pour le chiffrement");
      return;
    }
    
    setIsBackupInProgress(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: "Création de la sauvegarde en cours...",
        success: () => {
          setIsBackupInProgress(false);
          return `Sauvegarde ${backupType.toUpperCase()} créée avec succès${encryptBackup ? " et chiffrée" : ""}`;
        },
        error: "Erreur lors de la création de la sauvegarde"
      }
    );
  };

  const handleRestoreBackup = () => {
    setRestoreDialogOpen(false);
    
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: "Restauration des données en cours...",
        success: "Données restaurées avec succès",
        error: "Erreur lors de la restauration des données"
      }
    );
  };

  const handlePreviewBackup = (backupId: string) => {
    setSelectedBackupForRestore(backupId);
    setPreviewDialogOpen(true);
  };

  const handleInitiateRestore = (backupId: string) => {
    setSelectedBackupForRestore(backupId);
    setRestoreDialogOpen(true);
  };

  const handleDownloadBackup = (backupId: string) => {
    toast.success(`Sauvegarde téléchargée avec succès`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sauvegarde & Restauration</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les sauvegardes et la restauration des données
          </p>
        </div>
      </div>

      <Tabs defaultValue="backup">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="backup">Sauvegarde</TabsTrigger>
          <TabsTrigger value="restore">Restauration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Créer une Nouvelle Sauvegarde</CardTitle>
              <CardDescription>
                Sauvegarder toutes les données de votre système
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Type de Sauvegarde</h3>
                <RadioGroup 
                  defaultValue="json" 
                  value={backupType} 
                  onValueChange={setBackupType}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json">JSON (Compatible avec d'autres systèmes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sql" id="sql" />
                    <Label htmlFor="sql">SQL (Restauration complète de la base de données)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Stockage</h3>
                <RadioGroup defaultValue="local" className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="local" />
                    <Label htmlFor="local">Stockage Local (Téléchargement direct)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cloud" id="cloud" />
                    <Label htmlFor="cloud">Stockage Cloud (Conservation en ligne)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Sécurité</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    id="encrypt" 
                    checked={encryptBackup} 
                    onCheckedChange={setEncryptBackup} 
                  />
                  <Label htmlFor="encrypt">Chiffrer la sauvegarde</Label>
                </div>
                
                {encryptBackup && (
                  <div>
                    <Label htmlFor="password">Mot de passe de chiffrement</Label>
                    <div className="relative mt-1">
                      <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Entrez un mot de passe fort"
                        className="pl-8"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ce mot de passe sera nécessaire pour restaurer la sauvegarde
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleCreateBackup}
                disabled={isBackupInProgress}
              >
                {isBackupInProgress ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Créer une Sauvegarde
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Historique des Sauvegardes</CardTitle>
              <CardDescription>
                Liste des sauvegardes précédemment créées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Créé par</TableHead>
                    <TableHead>Stockage</TableHead>
                    <TableHead>Sécurité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>{backup.date}</TableCell>
                      <TableCell>{backup.type}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>{backup.createdBy}</TableCell>
                      <TableCell>{backup.stored}</TableCell>
                      <TableCell>
                        {backup.encrypted && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadBackup(backup.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreviewBackup(backup.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleInitiateRestore(backup.id)}
                          >
                            <Database className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="restore" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Restaurer depuis un Fichier</CardTitle>
              <CardDescription>
                Importer et restaurer une sauvegarde de données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Glissez-déposez un fichier de sauvegarde ou cliquez pour parcourir
                </p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".json,.sql"
                />
                <Button asChild>
                  <label htmlFor="file-upload">Parcourir les fichiers</label>
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Sécurité</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Switch id="decrypt" defaultChecked />
                  <Label htmlFor="decrypt">Déchiffrer la sauvegarde</Label>
                </div>
                
                <div>
                  <Label htmlFor="restore-password">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="restore-password"
                      type="password"
                      placeholder="Entrez le mot de passe de la sauvegarde"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Vérifier et Prévisualiser
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Points de Restauration Automatiques</CardTitle>
              <CardDescription>
                Points de restauration générés automatiquement par le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-03-26 00:00:00</TableCell>
                    <TableCell>Point de restauration quotidien</TableCell>
                    <TableCell>3.2 MB</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewBackup("auto-1")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInitiateRestore("auto-1")}
                        >
                          <Database className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-03-25 00:00:00</TableCell>
                    <TableCell>Point de restauration quotidien</TableCell>
                    <TableCell>3.1 MB</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewBackup("auto-2")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInitiateRestore("auto-2")}
                        >
                          <Database className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={restoreDialogOpen}
        onOpenChange={setRestoreDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la Restauration</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir restaurer cette sauvegarde ? Cette opération remplacera toutes les données actuelles. Assurez-vous d'avoir réalisé une sauvegarde de vos données actuelles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreBackup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Oui, Restaurer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Preview Dialog */}
      <AlertDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
      >
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Aperçu de la Sauvegarde</AlertDialogTitle>
            <AlertDialogDescription>
              Aperçu des données contenues dans cette sauvegarde
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="max-h-[60vh] overflow-auto border rounded-md p-4 my-4">
            <pre className="text-xs whitespace-pre-wrap">
              {`{
  "metadata": {
    "version": "1.0",
    "date": "2025-03-26T14:30:25Z",
    "app_version": "3.5.2",
    "encrypted": true
  },
  "stats": {
    "locations": 3,
    "products": 245,
    "categories": 12,
    "transactions": 1823,
    "clients": 150,
    "suppliers": 24
  },
  "sample_data": {
    "products": [
      { "id": "...", "name": "Produit 1", "price": 19.99, "stock": 50 },
      { "id": "...", "name": "Produit 2", "price": 29.99, "stock": 35 },
      { "id": "...", "name": "Produit 3", "price": 9.99, "stock": 120 }
    ],
    "transactions": [
      { "id": "...", "date": "2025-03-26", "amount": 123.45, "status": "completed" },
      { "id": "...", "date": "2025-03-25", "amount": 67.89, "status": "completed" }
    ]
  }
}`}
            </pre>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Fermer</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPreviewDialogOpen(false);
                setRestoreDialogOpen(true);
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Restaurer cette Sauvegarde
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BackupRestore;
