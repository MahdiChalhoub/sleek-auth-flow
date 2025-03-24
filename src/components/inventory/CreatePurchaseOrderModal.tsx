
import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { 
  Plus, 
  Trash2, 
  FileText, 
  CalendarIcon, 
  ScanLine,
  Save, 
  FilePlus, 
  Calculator 
} from "lucide-react";
import { mockProducts } from "@/models/product";
import { mockSuppliers } from "@/models/supplier";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatePurchaseOrderModalProps {
  supplier?: any;
  onClose?: () => void;
  onScan?: () => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  ordered: "bg-blue-100 text-blue-800",
  received: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800"
};

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({ 
  supplier, 
  onClose,
  onScan
}) => {
  const [formData, setFormData] = useState({
    supplierId: supplier?.id || "",
    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    paymentTerms: supplier?.paymentTerms || "",
    notes: "",
    status: "draft",
    discount: "0",
    tax: "0"
  });

  const [items, setItems] = useState<any[]>([
    { 
      productId: "", 
      quantity: 1, 
      unitCost: 0, 
      unitRetail: 0,
      margin: 0,
      subtotal: 0, 
      batch: "", 
      expirationDate: null
    }
  ]);

  const [calendarOpen, setCalendarOpen] = useState(false);

  // Automatically adjust the expected delivery date based on payment terms
  useEffect(() => {
    if (formData.paymentTerms.includes("Net")) {
      const days = parseInt(formData.paymentTerms.replace("Net ", ""));
      if (!isNaN(days)) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        setFormData(prev => ({ ...prev, expectedDelivery: newDate }));
      }
    }
  }, [formData.paymentTerms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, expectedDelivery: date }));
      setCalendarOpen(false);
    }
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...items];
    
    if (name === "productId" && value) {
      // When product is selected, set the default unit cost and retail price
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        const unitCost = Number((product.price * 0.7).toFixed(2));
        const unitRetail = Number(product.price);
        const margin = Number((((unitRetail - unitCost) / unitCost) * 100).toFixed(2));
        
        newItems[index] = {
          ...newItems[index],
          [name]: value,
          unitCost,
          unitRetail,
          margin,
          subtotal: (unitCost * newItems[index].quantity).toFixed(2)
        };
      } else {
        newItems[index] = { ...newItems[index], [name]: value };
      }
    } else if (name === "unitCost" || name === "quantity" || name === "unitRetail") {
      // When quantity, unitCost, or unitRetail changes, recalculate relevant values
      const quantity = name === "quantity" ? Number(value) : Number(newItems[index].quantity);
      const unitCost = name === "unitCost" ? Number(value) : Number(newItems[index].unitCost);
      const unitRetail = name === "unitRetail" ? Number(value) : Number(newItems[index].unitRetail);
      const margin = unitCost > 0 ? Number((((unitRetail - unitCost) / unitCost) * 100).toFixed(2)) : 0;
      
      newItems[index] = {
        ...newItems[index],
        [name]: value,
        margin,
        subtotal: (quantity * unitCost).toFixed(2)
      };
    } else {
      newItems[index] = { ...newItems[index], [name]: value };
    }
    
    setItems(newItems);
  };

  const handleItemDateChange = (index: number, date: Date | undefined) => {
    if (date) {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], expirationDate: date };
      setItems(newItems);
    }
  };

  const addItem = () => {
    setItems([...items, { 
      productId: "", 
      quantity: 1, 
      unitCost: 0, 
      unitRetail: 0,
      margin: 0,
      subtotal: 0, 
      batch: "", 
      expirationDate: null 
    }]);
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

  const handleScanBarcode = () => {
    // Call the onScan prop if provided
    if (onScan) {
      onScan();
    } else {
      console.log("Scan barcode functionality not implemented");
    }
  };

  // Filter products based on selected supplier if a supplier is selected
  const filteredProducts = formData.supplierId 
    ? mockProducts.filter(product => {
        const selectedSupplier = mockSuppliers.find(s => s.id === formData.supplierId);
        return selectedSupplier?.products.includes(product.id);
      })
    : mockProducts;

  // Effect to listen for barcode shortcut (Alt+B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'b') {
        event.preventDefault();
        handleScanBarcode();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DialogContent className="sm:max-w-[800px] bg-white/90 backdrop-blur-md border-slate-200/70 shadow-xl rounded-xl">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl">Create Purchase Order</DialogTitle>
          <Badge className={statusColors[formData.status]}>
            {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
          </Badge>
        </div>
        <DialogDescription>
          Fill in the details to create a new purchase order.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Supplier Selection */}
          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select 
              defaultValue={formData.supplierId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
              disabled={!!supplier}
            >
              <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border border-slate-200">
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                {mockSuppliers.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal bg-white/80 backdrop-blur-sm border border-slate-200"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expectedDelivery 
                    ? format(formData.expectedDelivery, "MMMM d, yyyy") 
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={formData.expectedDelivery} 
                  onSelect={handleDateChange}
                  className="p-3 pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Select 
              defaultValue={formData.paymentTerms} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
            >
              <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border border-slate-200">
                <SelectValue placeholder="Select Payment Terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Immediate">Immediate</SelectItem>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue={formData.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border border-slate-200">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ordered">Ordered</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="bg-white/80 backdrop-blur-sm border border-slate-200"
              placeholder="Add any special instructions or notes..."
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium">Order Items</Label>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleScanBarcode}
                className="flex items-center gap-1 text-sm"
                title="Scan Barcode (Alt+B)"
              >
                <ScanLine className="h-4 w-4" />
                Scan Barcode
                <kbd className="ml-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">Alt+B</kbd>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80 text-slate-700">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Product</th>
                    <th className="h-10 px-4 text-center font-medium w-20">Qty</th>
                    <th className="h-10 px-4 text-right font-medium">Unit Cost</th>
                    <th className="h-10 px-4 text-right font-medium">Retail Price</th>
                    <th className="h-10 px-4 text-center font-medium">Margin %</th>
                    <th className="h-10 px-4 text-right font-medium">Subtotal</th>
                    <th className="h-10 px-4 text-center font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t border-slate-200/60 hover:bg-slate-50/50">
                      <td className="p-2">
                        <Select 
                          defaultValue={item.productId} 
                          onValueChange={(value) => {
                            const e = { target: { name: "productId", value } } as React.ChangeEvent<HTMLSelectElement>;
                            handleItemChange(index, e);
                          }}
                        >
                          <SelectTrigger className="h-9 bg-white/80 border-slate-200/60">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProducts.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, e)}
                          min="1"
                          className="h-9 text-center bg-white/80 border-slate-200/60"
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
                          className="h-9 text-right bg-white/80 border-slate-200/60"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          name="unitRetail"
                          value={item.unitRetail}
                          onChange={(e) => handleItemChange(index, e)}
                          step="0.01"
                          min="0"
                          className="h-9 text-right bg-white/80 border-slate-200/60"
                          required
                        />
                      </td>
                      <td className="p-2 text-center">
                        <div className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          item.margin > 30 ? "bg-green-100 text-green-800" : 
                          item.margin > 15 ? "bg-blue-100 text-blue-800" : 
                          "bg-orange-100 text-orange-800"
                        )}>
                          {item.margin}%
                        </div>
                      </td>
                      <td className="p-2 text-right font-medium">
                        ${Number(item.subtotal).toFixed(2)}
                      </td>
                      <td className="p-2 text-center">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeItem(index)}
                          className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50/50"
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

          {/* Item Details */}
          {items.some(item => item.productId) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Number</Label>
                <Input
                  id="batch"
                  name="batch"
                  value={items[0].batch}
                  onChange={(e) => handleItemChange(0, e)}
                  placeholder="Optional"
                  className="bg-white/80 border-slate-200/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left font-normal bg-white/80 backdrop-blur-sm border border-slate-200/60"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {items[0].expirationDate 
                        ? format(items[0].expirationDate, "MMMM d, yyyy") 
                        : "Select expiration date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={items[0].expirationDate} 
                      onSelect={(date) => handleItemDateChange(0, date)}
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="mt-6 rounded-lg bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-slate-600" />
              Order Summary
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount ($)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discount}
                      onChange={handleChange}
                      className="bg-white/80 border-slate-200/60"
                    />
                  </div>
                  
                  <div className="space-y-2">
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
                      className="bg-white/80 border-slate-200/60"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 sm:border-l sm:pl-6 border-slate-200/60">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax ({formData.tax}%):</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <div className="flex flex-wrap gap-2 sm:justify-end w-full">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-initial">
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 sm:flex-initial"
              onClick={() => {
                setFormData(prev => ({ ...prev, status: "draft" }));
                handleSubmit(new Event('submit') as unknown as React.FormEvent);
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex-1 sm:flex-initial"
              onClick={() => setFormData(prev => ({ ...prev, status: "ordered" }))}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreatePurchaseOrderModal;
