import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Package } from "lucide-react";

interface PackagingLevel {
  id: string;
  name: string;
  barcode: string;
  conversion: number;
  parentId: string | null;
  children?: PackagingLevel[];
  costPrice?: number;
  sellingPrice?: number;
  margin?: number;
  stock?: number;
}

const initialTree: PackagingLevel = {
  id: "piece",
  name: "Piece",
  barcode: "BASE123456",
  conversion: 1,
  parentId: null,
  stock: 120,
  children: [
    {
      id: "pack",
      name: "Pack",
      barcode: "PACK987654",
      conversion: 10,
      parentId: "piece",
      stock: 12,
      children: [
        {
          id: "carton",
          name: "Carton",
          barcode: "CART555555",
          conversion: 12,
          parentId: "pack",
          stock: 3,
          children: [],
        },
      ],
    },
  ],
};

interface Operation {
  id: string;
  date: string;
  type: "boxing" | "deboxing";
  from: string;
  to: string;
  quantity: number;
  user: string;
}

const mockOperations: Operation[] = [
  {
    id: "1",
    date: "2024-01-05 09:15",
    type: "boxing",
    from: "Piece",
    to: "Pack",
    quantity: 100,
    user: "Admin",
  },
  {
    id: "2",
    date: "2024-01-03 11:00",
    type: "deboxing",
    from: "Carton",
    to: "Pack",
    quantity: 2,
    user: "John",
  },
];

const findLevel = (node: PackagingLevel, id: string): PackagingLevel | null => {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findLevel(child, id);
      if (found) return found;
    }
  }
  return null;
};

const PackagingManagement: React.FC = () => {
  const [tree] = useState<PackagingLevel>(initialTree);
  const [selectedId, setSelectedId] = useState<string>("piece");
  const [operations] = useState<Operation[]>(mockOperations);

  const selected = findLevel(tree, selectedId);

  const renderTree = (node: PackagingLevel) => (
    <li key={node.id} className="mb-1">
      <div
        className={`flex items-center gap-2 p-1 rounded cursor-pointer ${
          selectedId === node.id ? "bg-muted" : ""
        }`}
        onClick={() => setSelectedId(node.id)}
      >
        <Package className="h-4 w-4" />
        <span className="flex-1 text-sm">{node.name}</span>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="ml-4">{node.children.map(renderTree)}</ul>
      )}
    </li>
  );

  return (
    <div className="container mx-auto space-y-6 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Packaging Management</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Sample Product</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>Main Unit: Piece</p>
            <p>Base Barcode: BASE123456</p>
          </div>
          <div>
            <p>Current Stock: 120 pcs</p>
            <p>Category: Snacks</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Packaging Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <ul>{renderTree(tree)}</ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Level Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selected && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Unit Name</label>
                  <Input value={selected.name} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Parent Unit</label>
                  <Input value={selected.parentId ?? "—"} readOnly />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Conversion Ratio</label>
                  <Input type="number" value={selected.conversion} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Unit Barcode</label>
                  <Input value={selected.barcode} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Cost Price</label>
                  <Input type="number" value={selected.costPrice ?? ""} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Selling Price</label>
                  <Input type="number" value={selected.sellingPrice ?? ""} />
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Packaging Operations Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id}>
                  <TableCell>{op.date}</TableCell>
                  <TableCell className="capitalize">{op.type}</TableCell>
                  <TableCell>
                    {op.from} → {op.to}
                  </TableCell>
                  <TableCell className="text-right">{op.quantity}</TableCell>
                  <TableCell>{op.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagingManagement;

