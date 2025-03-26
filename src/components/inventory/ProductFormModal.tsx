import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Product, ComboComponent } from "@/models/product";
import { useLocationContext } from "@/contexts/LocationContext";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadButton } from "@/utils/uploadthing";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  barcode: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.coerce.number(),
  cost: z.coerce.number().optional(),
  stock: z.coerce.number(),
  minStockLevel: z.coerce.number().optional(),
  maxStockLevel: z.coerce.number().optional(),
  isCombo: z.boolean().default(false),
  hasStock: z.boolean().default(true),
  imageUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormModalProps {
  product?: Product;
  onClose?: () => void;
  currentLocation: any;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, currentLocation }) => {
  const [isCombo, setIsCombo] = useState(product?.isCombo || false);
  const [comboComponents, setComboComponents] = useState<ComboComponent[]>(product?.comboComponents || []);
  const [categories, setCategories] = useState<any[]>([]);
	const [imageUrl, setImageUrl] = useState<string | undefined>(product?.imageUrl);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } else {
        setCategories(data);
      }
    };
    
    fetchCategories();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      barcode: product?.barcode || "",
      categoryId: product?.categoryId || "",
      price: product?.price || 0,
      cost: product?.cost || 0,
      stock: product?.stock || 0,
      minStockLevel: product?.minStockLevel || 5,
      maxStockLevel: product?.maxStockLevel || 100,
      isCombo: product?.isCombo || false,
      hasStock: product?.hasStock !== undefined ? product.hasStock : true,
      imageUrl: product?.imageUrl
    },
  });

  const handleAddComboComponent = () => {
    const now = new Date().toISOString();
    const newComponent: ComboComponent = {
      id: uuidv4(),
      comboProductId: product?.id || '',
      componentProductId: '',
      quantity: 1,
      createdAt: now,
      updatedAt: now,
    };
    
    setComboComponents([...comboComponents, newComponent]);
  };

  const handleRemoveComboComponent = (id: string) => {
    setComboComponents(comboComponents.filter(component => component.id !== id));
  };

  const handleComboComponentChange = (index: number, field: 'componentProductId' | 'quantity', value: string | number) => {
    const updatedComponents = [...comboComponents];
    if (field === 'componentProductId') {
      updatedComponents[index] = {
        ...updatedComponents[index],
        componentProductId: value as string
      };
    } else if (field === 'quantity') {
      updatedComponents[index] = {
        ...updatedComponents[index],
        quantity: Number(value)
      };
    }
    setComboComponents(updatedComponents);
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const productData = {
        ...data,
        is_combo: data.isCombo,
        has_stock: data.hasStock,
        category_id: data.categoryId,
        image_url: imageUrl,
      };

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) {
          console.error("Error updating product:", error);
          toast.error("Failed to update product");
          return;
        }

        toast.success("Product updated successfully!");
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          console.error("Error creating product:", error);
          toast.error("Failed to create product");
          return;
        }

        toast.success("Product created successfully!");
      }

      onClose?.();
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An unexpected error occurred");
    }
  };

	const onFileChange = (url?: string) => {
		setImageUrl(url);
	};

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
        <DialogDescription>
          {product ? "Edit details of the selected product" : "Enter details for the new product"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Barcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Cost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minStockLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Stock Level</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Min. Stock Level" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxStockLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max. Stock Level</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Max. Stock Level" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="hasStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Track Stock
                    </FormLabel>
                    <FormDescription>
                      Enable stock tracking for this product
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="isCombo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onCheckedChange={() => setIsCombo(!isCombo)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Is Combo
                    </FormLabel>
                    <FormDescription>
                      Enable if this product is a combo
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {isCombo && (
            <div className="space-y-4">
              <Label>Combo Components</Label>
              {comboComponents.map((component, index) => (
                <div key={component.id} className="flex items-center space-x-4">
                  <div className="w-1/2">
                    <Label htmlFor={`component-${index}`}>Component {index + 1}</Label>
                    <Input
                      type="text"
                      id={`component-${index}`}
                      value={component.componentProductId}
                      onChange={(e) => handleComboComponentChange(index, 'componentProductId', e.target.value)}
                      placeholder="Component Product ID"
                    />
                  </div>
                  <div className="w-1/4">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      type="number"
                      id={`quantity-${index}`}
                      value={component.quantity}
                      onChange={(e) => handleComboComponentChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveComboComponent(component.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={handleAddComboComponent}>
                Add Component
              </Button>
            </div>
          )}

					<div>
						<Label>Image</Label>
						<UploadButton
							endpoint="imageUpload"
							onClientUploadComplete={(res) => {
								console.log("Files: ", res);
								if (res && res.length > 0) {
									form.setValue("imageUrl", res[0].url);
									setImageUrl(res[0].url);
									toast.success("Image uploaded successfully!");
								}
							}}
							onUploadError={(error: Error) => {
								toast.error(`Failed to upload image: ${error.message}`);
							}}
						/>
						{imageUrl && (
							<img
								src={imageUrl}
								alt="Product Image"
								className="mt-2 rounded-md object-cover"
								style={{ maxWidth: '200px', maxHeight: '200px' }}
							/>
						)}
					</div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ProductFormModal;
