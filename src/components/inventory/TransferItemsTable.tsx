
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { mockProducts } from "@/models/product";

interface TransferItem {
  productId: string;
  quantity: number;
}

interface TransferItemsTableProps {
  items: TransferItem[];
  onItemChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const TransferItemsTable: React.FC<TransferItemsTableProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Transfer Items</label>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="h-10 px-4 text-left font-medium">Product</th>
              <th className="h-10 px-4 text-center font-medium w-20">Quantity</th>
              <th className="h-10 px-4 text-center font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">
                  <select
                    name="productId"
                    value={item.productId}
                    onChange={(e) => onItemChange(index, e)}
                    className="w-full rounded-md border-0 bg-transparent focus:ring-0 sm:text-sm"
                    required
                  >
                    <option value="">Select Product</option>
                    {mockProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => onItemChange(index, e)}
                    min="1"
                    className="h-8 text-center"
                    required
                  />
                </td>
                <td className="p-2 text-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onRemoveItem(index)}
                    className="h-8 w-8 text-destructive"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferItemsTable;
