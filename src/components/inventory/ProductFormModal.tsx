
import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Upload, RefreshCw } from "lucide-react";

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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateBarcode = () => {
    // Generate a random 10-digit barcode
    const randomBarcode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setFormData(prev => ({ ...prev, barcode: randomBarcode }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", formData);
    onClose && onClose();
  };

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
    </DialogContent>
  );
};

export default ProductFormModal;
