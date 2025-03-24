
import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Upload, RefreshCw, Plus, Trash2, Calculator, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { mockProducts, Product, ComboComponent } from "@/models/product";
import SecurityCodeDialog from "./SecurityCodeDialog";

interface ProductFormModalProps {
  product?: any;
  onClose?: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    barcode: product?.barcode || "",
    unitCost: product?.price ? (product.price * 0.7).toFixed(2) : "",
    retailPrice: product?.price?.toFixed(2) || "",
    quantity: product?.stock?.toString() || "",
    lowStockThreshold: "10",
    sku: product?.id ? `SKU-${product.id.padStart(6, '0')}` : "",
    expirationDate: "",
    image: product?.image || "",
    isCombo: product?.isCombo || false,
    hasStock: product?.hasStock !== false // default to true for regular products
  });

  const [comboComponents, setComboComponents] = useState<ComboComponent[]>(
    product?.comboComponents || []
  );
  
  const [isAutoPrice, setIsAutoPrice] = useState(true);
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false);
  const [securityAction, setSecurityAction] = useState<string | null>(null);
  const [isComboSectionOpen, setIsComboSectionOpen] = useState(false);

  // Calculate profit margin
  const calculateProfitMargin = (): number => {
    const cost = parseFloat(formData.unitCost) || 0;
    const retail = parseFloat(formData.retailPrice) || 0;
    
    if (cost === 0) return 0;
    return ((retail - cost) / cost) * 100;
  };

  // Get profit margin color
  const getProfitMarginColor = (): string => {
    const margin = calculateProfitMargin();
    
    if (margin >= 20) return "text-green-500";
    if (margin > 0) return "text-orange-500";
    return "text-red-500";
  };

  // Calculate combo cost from components
  const calculateComboCost = (): number => {
    return comboComponents.reduce((total, item) => {
      const productCost = parseFloat(((mockProducts.find(p => p.id === item.productId)?.price || 0) * 0.7).toFixed(2));
      return total + (productCost * item.quantity);
    }, 0);
  };

  // Update retail price based on combo components
  useEffect(() => {
    if (formData.isCombo && isAutoPrice && comboComponents.length > 0) {
      const comboCost = calculateComboCost();
      setFormData(prev => ({
        ...prev,
        unitCost: comboCost.toFixed(2),
        retailPrice: (comboCost * 1.3).toFixed(2) // 30% markup as default
      }));
    }
  }, [comboComponents, isAutoPrice, formData.isCombo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === "isCombo" && checked) {
      setIsSecurityDialogOpen(true);
      setSecurityAction("enableCombo");
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    if (name === "isCombo") {
      setIsComboSectionOpen(checked);
    }
  };

  const handleSecurityConfirm = () => {
    setIsSecurityDialogOpen(false);
    
    if (securityAction === "enableCombo") {
      setFormData(prev => ({ ...prev, isCombo: true }));
      setIsComboSectionOpen(true);
    } else if (securityAction === "manualPrice") {
      setIsAutoPrice(false);
    }
    
    setSecurityAction(null);
  };

  const handlePriceOverride = () => {
    setIsSecurityDialogOpen(true);
    setSecurityAction("manualPrice");
  };

  const generateBarcode = () => {
    // Generate a random 10-digit barcode
    const randomBarcode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setFormData(prev => ({ ...prev, barcode: randomBarcode }));
  };

  const addComboComponent = () => {
    const newComponent: ComboComponent = {
      productId: "",
      quantity: 1,
      product: {} as Product
    };
    
    setComboComponents([...comboComponents, newComponent]);
  };

  const removeComboComponent = (index: number) => {
    const updatedComponents = [...comboComponents];
    updatedComponents.splice(index, 1);
    setComboComponents(updatedComponents);
  };

  const updateComboComponent = (index: number, field: string, value: string | number) => {
    const updatedComponents = [...comboComponents];
    
    if (field === "productId" && typeof value === "string") {
      const selectedProduct = mockProducts.find(p => p.id === value);
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value,
        product: selectedProduct as Product
      };
    } else {
      updatedComponents[index] = {
        ...updatedComponents[index],
        [field]: value
      };
    }
    
    setComboComponents(updatedComponents);
  };

  const getComboSummary = (): string => {
    if (comboComponents.length === 0) return "No components added";
    
    return comboComponents
      .filter(item => item.productId)
      .map(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        return `${item.quantity}x ${product?.name || "Unknown product"}`;
      })
      .join(", ");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional validation for combo products
    if (formData.isCombo) {
      if (comboComponents.length === 0) {
        toast.error("Combo products must have at least one component");
        return;
      }
      
      if (comboComponents.some(item => !item.productId)) {
        toast.error("All combo components must have a selected product");
        return;
      }
    }
    
    console.log("Product data:", formData);
    console.log("Combo components:", comboComponents);
    toast.success(`${product ? "Updated" : "Added"} product successfully`);
    onClose && onClose();
  };

  const profit = calculateProfitMargin();
  const profitColor = getProfitMarginColor();

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {product 
            ? "Update the product details below." 
            : "Fill in the details to add a new product to inventory."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Combo product toggle */}
          <div className="sm:col-span-2 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border">
            <div>
              <h3 className="font-medium">This is a Combo Product</h3>
              <p className="text-sm text-muted-foreground">Combine multiple products into a single sellable item</p>
            </div>
            <Switch
              checked={formData.isCombo}
              onCheckedChange={(checked) => handleSwitchChange("isCombo", checked)}
            />
          </div>

          {formData.isCombo && (
            <>
              {/* Combo Stock Behavior */}
              <div className="sm:col-span-2 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-lg border">
                <div>
                  <h3 className="font-medium">Track Combo Stock</h3>
                  <p className="text-sm text-muted-foreground">When disabled, only individual components affect inventory</p>
                </div>
                <Switch
                  checked={formData.hasStock}
                  onCheckedChange={(checked) => handleSwitchChange("hasStock", checked)}
                />
              </div>

              {/* Combo Components Section */}
              <div className="sm:col-span-2 border rounded-lg p-3">
                <Collapsible 
                  open={isComboSectionOpen} 
                  onOpenChange={setIsComboSectionOpen}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Combo Components</h3>
                      <p className="text-xs text-muted-foreground">{getComboSummary()}</p>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        {isComboSectionOpen ? "Hide Components" : "Show Components"}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="space-y-4">
                    {comboComponents.length === 0 ? (
                      <div className="py-2 text-center text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 mx-auto mb-1" />
                        No components added. Add components to create a combo.
                      </div>
                    ) : (
                      comboComponents.map((component, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-6">
                            <Label htmlFor={`component-${index}`} className="text-xs">Product</Label>
                            <select
                              id={`component-${index}`}
                              value={component.productId}
                              onChange={(e) => updateComboComponent(index, "productId", e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              required
                            >
                              <option value="">Select Product</option>
                              {mockProducts
                                .filter(p => !p.isCombo) // Don't allow combos inside combos
                                .map(product => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} (Stock: {product.stock})
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`quantity-${index}`} className="text-xs">Quantity</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={component.quantity}
                              onChange={(e) => updateComboComponent(index, "quantity", parseInt(e.target.value))}
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Unit Cost</Label>
                            <div className="py-2 px-3 border rounded-md h-10 bg-muted/50 text-sm">
                              ${(mockProducts.find(p => p.id === component.productId)?.price || 0) * 0.7 * component.quantity}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeComboComponent(index)}
                              className="h-10 w-10 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addComboComponent}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Component
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              {/* Combo Pricing Section */}
              <div className="sm:col-span-2 border rounded-lg p-4 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Combo Pricing</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={isAutoPrice ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setIsAutoPrice(true)}
                      disabled={isAutoPrice}
                      className="h-8"
                    >
                      <Calculator className="h-3.5 w-3.5 mr-1" />
                      Auto Price
                    </Button>
                    <Button
                      type="button"
                      variant={!isAutoPrice ? "secondary" : "outline"}
                      size="sm"
                      onClick={handlePriceOverride}
                      disabled={!isAutoPrice}
                      className="h-8"
                    >
                      Manual Price
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Total Cost</Label>
                    <div className="py-2 px-3 border rounded-md bg-muted/50 text-sm">
                      ${calculateComboCost().toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="retailPrice">Selling Price</Label>
                    <Input
                      id="retailPrice"
                      name="retailPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.retailPrice}
                      onChange={handleChange}
                      disabled={isAutoPrice}
                      required
                    />
                  </div>
                  <div>
                    <Label>Profit Margin</Label>
                    <div className={`py-2 px-3 border rounded-md ${profitColor}`}>
                      {profit.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Select Category</option>
              <option value="mobile">Mobile</option>
              <option value="electronics">Electronics</option>
              <option value="grocery">Grocery</option>
              <option value="beverages">Beverages</option>
              <option value="food">Food</option>
              <option value="clothing">Clothing</option>
              <option value="kitchenware">Kitchenware</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
              <option value="gaming">Gaming</option>
              <option value="baby">Baby</option>
              <option value="combo">Combo Pack</option>
            </select>
          </div>

          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Auto-generated"
              disabled={!!product}
            />
          </div>

          <div className="relative">
            <Label htmlFor="barcode">Barcode</Label>
            <div className="flex gap-2">
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={generateBarcode}
                className="h-10 w-10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
            />
          </div>

          {!formData.isCombo && (
            <>
              <div>
                <Label htmlFor="unitCost">Unit Cost ($)</Label>
                <Input
                  id="unitCost"
                  name="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="retailPrice">Retail Price ($)</Label>
                <Input
                  id="retailPrice"
                  name="retailPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.retailPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <Label>Profit Margin</Label>
                <div className={`mt-2 py-2 px-3 border rounded-md ${profitColor}`}>
                  {profit.toFixed(2)}%
                </div>
              </div>
            </>
          )}

          {/* Only show quantity and threshold for non-combo or combo with stock */}
          {(!formData.isCombo || formData.hasStock) && (
            <>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <Label>Product Image</Label>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-4">
              {formData.image && (
                <div className="w-32 h-32 rounded border overflow-hidden">
                  <img 
                    src={formData.image} 
                    alt="Product" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-2 w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recommended: 500x500px JPG, PNG or GIF (max 2MB)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode Preview */}
        {formData.barcode && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Barcode Preview</p>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            </div>
            <div className="flex justify-center py-2 bg-white">
              {/* Barcode representation (in real app, use a proper barcode library) */}
              <div className="text-center">
                <div className="h-16 bg-[url('https://t3.ftcdn.net/jpg/00/58/33/12/360_F_58331212_HcxnQJjV1a9hfyK0uUOp7xpO6SQC23rS.jpg')] bg-contain bg-no-repeat bg-center w-48"></div>
                <p className="text-xs mt-1">{formData.barcode}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </DialogFooter>
      </form>

      {/* Security Code Dialog */}
      <SecurityCodeDialog
        title={securityAction === "enableCombo" ? "Enable Combo Product" : "Manual Price Override"}
        description={securityAction === "enableCombo" 
          ? "Enter security code to create a combo product" 
          : "Enter security code to manually set combo price"
        }
        isOpen={isSecurityDialogOpen}
        onClose={() => setIsSecurityDialogOpen(false)}
        onConfirm={handleSecurityConfirm}
        onCancel={() => {
          setIsSecurityDialogOpen(false);
          setSecurityAction(null);
        }}
      />
    </DialogContent>
  );
};

export default ProductFormModal;
