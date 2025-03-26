
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  description?: string;
  isBase?: boolean;
  conversionRate?: number;
  baseUnitId?: string;
}

const Units: React.FC = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState<Unit[]>([
    { id: "1", name: "Kilogramme", abbreviation: "kg", description: "Unité de masse standard", isBase: true },
    { id: "2", name: "Gramme", abbreviation: "g", description: "Sous-unité du kilogramme", isBase: false, conversionRate: 0.001, baseUnitId: "1" },
    { id: "3", name: "Litre", abbreviation: "L", description: "Unité de volume standard", isBase: true },
    { id: "4", name: "Millilitre", abbreviation: "ml", description: "Sous-unité du litre", isBase: false, conversionRate: 0.001, baseUnitId: "3" },
    { id: "5", name: "Pièce", abbreviation: "pc", description: "Unité de comptage standard", isBase: true },
    { id: "6", name: "Carton", abbreviation: "ctn", description: "Carton contenant plusieurs pièces", isBase: false, conversionRate: 12, baseUnitId: "5" }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: "",
    abbreviation: "",
    description: "",
    isBase: false,
    conversionRate: undefined,
    baseUnitId: undefined
  });

  const baseUnits = units.filter(unit => unit.isBase);

  const handleAddUnit = () => {
    if (!newUnit.name || !newUnit.abbreviation) {
      toast({
        title: "Erreur",
        description: "Le nom et l'abréviation sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!newUnit.isBase && (!newUnit.conversionRate || !newUnit.baseUnitId)) {
      toast({
        title: "Erreur",
        description: "Le taux de conversion et l'unité de base sont obligatoires pour les unités dérivées",
        variant: "destructive"
      });
      return;
    }

    const id = (units.length + 1).toString();
    setUnits([...units, { id, ...newUnit as Unit }]);
    setIsAddDialogOpen(false);
    setNewUnit({
      name: "",
      abbreviation: "",
      description: "",
      isBase: false,
      conversionRate: undefined,
      baseUnitId: undefined
    });
    
    toast({
      title: "Unité ajoutée",
      description: `L'unité ${newUnit.name} a été ajoutée avec succès`
    });
  };

  const handleEditUnit = () => {
    if (!currentUnit) return;
    
    if (!currentUnit.name || !currentUnit.abbreviation) {
      toast({
        title: "Erreur",
        description: "Le nom et l'abréviation sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!currentUnit.isBase && (!currentUnit.conversionRate || !currentUnit.baseUnitId)) {
      toast({
        title: "Erreur",
        description: "Le taux de conversion et l'unité de base sont obligatoires pour les unités dérivées",
        variant: "destructive"
      });
      return;
    }

    setUnits(units.map(unit => unit.id === currentUnit.id ? currentUnit : unit));
    setIsEditDialogOpen(false);
    setCurrentUnit(null);
    
    toast({
      title: "Unité modifiée",
      description: `L'unité ${currentUnit.name} a été modifiée avec succès`
    });
  };

  const handleDeleteUnit = () => {
    if (!currentUnit) return;
    
    // Check if any unit uses this as a base unit
    const hasChildUnits = units.some(unit => unit.baseUnitId === currentUnit.id);
    
    if (hasChildUnits) {
      toast({
        title: "Suppression impossible",
        description: "Cette unité est utilisée comme base pour d'autres unités",
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      return;
    }
    
    setUnits(units.filter(unit => unit.id !== currentUnit.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Unité supprimée",
      description: `L'unité ${currentUnit.name} a été supprimée avec succès`
    });
    setCurrentUnit(null);
  };

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getBaseUnitName = (baseUnitId?: string) => {
    if (!baseUnitId) return "-";
    const baseUnit = units.find(unit => unit.id === baseUnitId);
    return baseUnit ? baseUnit.name : "-";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Unités</CardTitle>
              <CardDescription>
                Créez et gérez des unités de mesure pour vos produits
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Ajouter une unité
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Rechercher une unité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Les unités de base ne peuvent pas être supprimées si elles sont utilisées comme référence pour d'autres unités.
            </AlertDescription>
          </Alert>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Abréviation</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Taux de conversion</TableHead>
                  <TableHead>Unité de base</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Aucune unité trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUnits.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell className="font-medium">{unit.name}</TableCell>
                      <TableCell>{unit.abbreviation}</TableCell>
                      <TableCell>{unit.description || "-"}</TableCell>
                      <TableCell>{unit.isBase ? "Base" : "Dérivée"}</TableCell>
                      <TableCell>{unit.isBase ? "-" : unit.conversionRate}</TableCell>
                      <TableCell>{unit.isBase ? "-" : getBaseUnitName(unit.baseUnitId)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setCurrentUnit(unit);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => {
                              setCurrentUnit(unit);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Unit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une unité</DialogTitle>
            <DialogDescription>
              Créez une nouvelle unité de mesure. Les unités de base sont indépendantes, tandis que les unités dérivées sont basées sur une unité de base.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nom
                </label>
                <Input
                  id="name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                  placeholder="Exemple: Kilogramme"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="abbreviation" className="text-sm font-medium">
                  Abréviation
                </label>
                <Input
                  id="abbreviation"
                  value={newUnit.abbreviation}
                  onChange={(e) => setNewUnit({ ...newUnit, abbreviation: e.target.value })}
                  placeholder="Exemple: kg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={newUnit.description || ""}
                onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                placeholder="Description optionnelle"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isBase"
                checked={newUnit.isBase}
                onChange={(e) => setNewUnit({ 
                  ...newUnit, 
                  isBase: e.target.checked,
                  // Reset related fields when switching types
                  conversionRate: e.target.checked ? undefined : newUnit.conversionRate,
                  baseUnitId: e.target.checked ? undefined : newUnit.baseUnitId
                })}
                className="rounded border-gray-300"
              />
              <label htmlFor="isBase" className="text-sm font-medium">
                Cette unité est une unité de base
              </label>
            </div>
            {!newUnit.isBase && (
              <>
                <div className="space-y-2">
                  <label htmlFor="conversionRate" className="text-sm font-medium">
                    Taux de conversion
                  </label>
                  <Input
                    id="conversionRate"
                    type="number"
                    step="0.001"
                    value={newUnit.conversionRate || ""}
                    onChange={(e) => setNewUnit({ ...newUnit, conversionRate: parseFloat(e.target.value) })}
                    placeholder="Exemple: 0.001 pour gramme à kg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Combien d'unités de base équivalent à 1 de cette unité?
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="baseUnit" className="text-sm font-medium">
                    Unité de base
                  </label>
                  <select
                    id="baseUnit"
                    value={newUnit.baseUnitId || ""}
                    onChange={(e) => setNewUnit({ ...newUnit, baseUnitId: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Sélectionner une unité de base</option>
                    {baseUnits.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUnit}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier une unité</DialogTitle>
            <DialogDescription>
              Modifiez les détails de l'unité sélectionnée.
            </DialogDescription>
          </DialogHeader>
          {currentUnit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="edit-name"
                    value={currentUnit.name}
                    onChange={(e) => setCurrentUnit({ ...currentUnit, name: e.target.value })}
                    placeholder="Exemple: Kilogramme"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-abbreviation" className="text-sm font-medium">
                    Abréviation
                  </label>
                  <Input
                    id="edit-abbreviation"
                    value={currentUnit.abbreviation}
                    onChange={(e) => setCurrentUnit({ ...currentUnit, abbreviation: e.target.value })}
                    placeholder="Exemple: kg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={currentUnit.description || ""}
                  onChange={(e) => setCurrentUnit({ ...currentUnit, description: e.target.value })}
                  placeholder="Description optionnelle"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isBase"
                  checked={currentUnit.isBase}
                  onChange={(e) => setCurrentUnit({ 
                    ...currentUnit, 
                    isBase: e.target.checked,
                    // Reset related fields when switching types
                    conversionRate: e.target.checked ? undefined : currentUnit.conversionRate,
                    baseUnitId: e.target.checked ? undefined : currentUnit.baseUnitId
                  })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="edit-isBase" className="text-sm font-medium">
                  Cette unité est une unité de base
                </label>
              </div>
              {!currentUnit.isBase && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="edit-conversionRate" className="text-sm font-medium">
                      Taux de conversion
                    </label>
                    <Input
                      id="edit-conversionRate"
                      type="number"
                      step="0.001"
                      value={currentUnit.conversionRate || ""}
                      onChange={(e) => setCurrentUnit({ ...currentUnit, conversionRate: parseFloat(e.target.value) })}
                      placeholder="Exemple: 0.001 pour gramme à kg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Combien d'unités de base équivalent à 1 de cette unité?
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-baseUnit" className="text-sm font-medium">
                      Unité de base
                    </label>
                    <select
                      id="edit-baseUnit"
                      value={currentUnit.baseUnitId || ""}
                      onChange={(e) => setCurrentUnit({ ...currentUnit, baseUnitId: e.target.value })}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Sélectionner une unité de base</option>
                      {baseUnits
                        .filter(unit => unit.id !== currentUnit.id) // Can't reference itself
                        .map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name} ({unit.abbreviation})
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditUnit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Unit Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer une unité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette unité ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentUnit && (
            <div className="py-4">
              <p>
                Vous êtes sur le point de supprimer l'unité <strong>{currentUnit.name}</strong> ({currentUnit.abbreviation}).
              </p>
              {currentUnit.isBase && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Attention</AlertTitle>
                  <AlertDescription>
                    Cette unité est une unité de base. Sa suppression pourrait affecter d'autres unités qui en dépendent.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnit}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Units;
