
import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, FileText } from "lucide-react";
import { mockProducts } from "@/models/product";
import { mockSuppliers } from "@/models/supplier";

interface CreatePurchaseOrderModalProps {
  supplier?: any;
  onClose?: () => void;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ supplier, onClose }) => {
  const [formData, setFormData] = useState({
    supplierId: supplier?.id || "",
    expectedDelivery: "",
    paymentTerms: supplier?.paymentTerms || "",
    notes: "",
    discount: "0",
    tax: "0"
  });

  const [items, setItems] = useState<any[]>([
    { productId: "", quantity: 1, unitCost: 0, subtotal: 0, batch: "", expirationDate: "" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...items];
    
    if (name === "productId" && value) {
      // When product is selected, set the default unit cost
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        const unitCost = Number((product.price * 0.7).toFixed(2));
        newItems[index] = {
          ...newItems[index],
          [name]: value,
          unitCost,
          subtotal: unitCost * newItems[index].quantity
        };
      } else {
        newItems[index] = { ...newItems[index], [name]: value };
      }
    } else if (name === "quantity" || name === "unitCost") {
      // When quantity or unitCost changes, recalculate subtotal
      const quantity = name === "quantity" ? Number(value) : Number(newItems[index].quantity);
      const unitCost = name === "unitCost" ? Number(value) : Number(newItems[index].unitCost);
      newItems[index] = {
        ...newItems[index],
        [name]: value,
        subtotal: (quantity * unitCost).toFixed(2)
      };
    } else {
      newItems[index] = { ...newItems[index], [name]: value };
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, unitCost: 0, subtotal: 0, batch: "", expirationDate: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  const taxAmount = (subtotal * Number(formData.tax) / 100);
  const discountAmount = Number(formData.discount);
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PO data:", { ...formData, items, subtotal, taxAmount, discountAmount, total });
    onClose && onClose();
  };

  // Filter products based on selected supplier if a supplier is selected
  const filteredProducts = formData.supplierId 
    ? mockProducts.filter(product => {
        const selectedSupplier = mockSuppliers.find(s => s.id === formData.supplierId);
        return selectedSupplier?.products.includes(product.id);
      })
    : mockProducts;

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new purchase order.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supplier Selection */}
          <div>
            <Label htmlFor="supplierId">Supplier</Label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
              disabled={!!supplier}
            >
              <option value="">Select Supplier</option>
              {mockSuppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
            <Input
              id="expectedDelivery"
              name="expectedDelivery"
              type="date"
              value={formData.expectedDelivery}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select Payment Terms</option>
              <option value="Immediate">Immediate</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 45">Net 45</option>
              <option value="Net 60">Net 60</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Order Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-center font-medium w-20">Qty</th>
                  <th className="h-10 px-4 text-right font-medium">Unit Cost</th>
                  <th className="h-10 px-4 text-right font-medium">Subtotal</th>
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
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full rounded-md border-0 bg-transparent focus:ring-0 sm:text-sm"
                        required
                      >
                        <option value="">Select Product</option>
                        {filteredProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        min="1"
                        className="h-8 text-center"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        name="unitCost"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(index, e)}
                        step="0.01"
                        min="0"
                        className="h-8 text-right"
                        required
                      />
                    </td>
                    <td className="p-2 text-right">
                      ${Number(item.subtotal).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
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

          {/* Item Details */}
          {items.some(item => item.productId) && (
            <div className="p-4 border rounded-md bg-muted/30">
              <h4 className="text-sm font-medium mb-3">Item Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    name="batch"
                    value={items[0].batch}
                    onChange={(e) => handleItemChange(0, e)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    value={items[0].expirationDate}
                    onChange={(e) => handleItemChange(0, e)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="flex flex-col items-end space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                className="text-right"
              />
              
              <Label htmlFor="tax">Tax (%)</Label>
              <Input
                id="tax"
                name="tax"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.tax}
                onChange={handleChange}
                className="text-right"
              />
            </div>
            
            <div className="w-full max-w-xs border-t pt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax ({formData.tax}%):</span>
                <span className="text-sm">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Discount:</span>
                <span className="text-sm">-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button type="submit">
            Create PO
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreatePurchaseOrderModal;
