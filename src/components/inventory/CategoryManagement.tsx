
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Search, ChevronRight, FolderPlus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description?: string;
  productCount: number;
}

const mockCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Electronics",
    parentId: null,
    description: "All electronic devices and accessories",
    productCount: 25
  },
  {
    id: "CAT-002",
    name: "Smartphones",
    parentId: "CAT-001",
    description: "Mobile phones and accessories",
    productCount: 12
  },
  {
    id: "CAT-003",
    name: "iPhones",
    parentId: "CAT-002",
    description: "Apple iPhone products",
    productCount: 4
  },
  {
    id: "CAT-004",
    name: "Android Phones",
    parentId: "CAT-002",
    description: "Android-based smartphones",
    productCount: 8
  },
  {
    id: "CAT-005",
    name: "Computers",
    parentId: "CAT-001",
    description: "Desktops, laptops and accessories",
    productCount: 10
  },
  {
    id: "CAT-006",
    name: "Laptops",
    parentId: "CAT-005",
    description: "Portable computers",
    productCount: 6
  },
  {
    id: "CAT-007",
    name: "Groceries",
    parentId: null,
    description: "Food and household items",
    productCount: 30
  },
  {
    id: "CAT-008",
    name: "Fresh Produce",
    parentId: "CAT-007",
    description: "Fresh fruits and vegetables",
    productCount: 15
  },
  {
    id: "CAT-009",
    name: "Beverages",
    parentId: "CAT-007",
    description: "Drinks and liquid refreshments",
    productCount: 12
  },
  {
    id: "CAT-010",
    name: "Coffee & Tea",
    parentId: "CAT-009",
    description: "Coffee beans, ground coffee, and tea varieties",
    productCount: 8
  }
];

// Create form schema for category
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Category name must be at least 2 characters." })
    .max(50, { message: "Category name cannot exceed 50 characters." }),
  parentId: z.string().nullable(),
  description: z.string().max(200, { message: "Description cannot exceed 200 characters." }).optional(),
});

const CategoryManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentId: null,
      description: "",
    },
  });
  
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentId: null,
      description: "",
    },
  });
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to get all parent categories (for select dropdown)
  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId || cat.parentId === "");
  };
  
  // Function to check if a category has subcategories
  const hasSubcategories = (categoryId: string) => {
    return categories.some(cat => cat.parentId === categoryId);
  };
  
  // Function to get subcategories for a parent category
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId);
  };
  
  // Function to get category path for display
  const getCategoryPath = (category: Category): string => {
    const path: string[] = [category.name];
    let currentParentId = category.parentId;
    
    while (currentParentId) {
      const parent = categories.find(cat => cat.id === currentParentId);
      if (parent) {
        path.unshift(parent.name);
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }
    
    return path.join(" > ");
  };
  
  // Function to get indentation level for category
  const getCategoryLevel = (category: Category): number => {
    let level = 0;
    let currentParentId = category.parentId;
    
    while (currentParentId) {
      level++;
      const parent = categories.find(cat => cat.id === currentParentId);
      currentParentId = parent?.parentId || null;
    }
    
    return level;
  };
  
  const handleAddCategory = (data: z.infer<typeof formSchema>) => {
    // Generate a new ID (in a real app this would come from the backend)
    const newId = `CAT-${String(categories.length + 1).padStart(3, '0')}`;
    
    const newCategory: Category = {
      id: newId,
      name: data.name,
      parentId: data.parentId,
      description: data.description,
      productCount: 0
    };
    
    setCategories([...categories, newCategory]);
    form.reset();
    setIsAddModalOpen(false);
    toast({
      title: "Category Added",
      description: `${data.name} has been successfully added.`,
    });
  };
  
  const handleEditCategory = (data: z.infer<typeof formSchema>) => {
    if (!selectedCategory) return;
    
    setCategories(categories.map(cat => 
      cat.id === selectedCategory.id
        ? { ...cat, name: data.name, parentId: data.parentId, description: data.description }
        : cat
    ));
    
    setIsEditModalOpen(false);
    toast({
      title: "Category Updated",
      description: `${data.name} has been successfully updated.`,
    });
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    // Check if category has subcategories
    if (hasSubcategories(selectedCategory.id)) {
      toast({
        title: "Cannot Delete",
        description: "This category has subcategories. Delete or reassign them first.",
        variant: "destructive",
      });
      setIsDeleteModalOpen(false);
      return;
    }
    
    // Check if category has products
    if (selectedCategory.productCount > 0) {
      toast({
        title: "Cannot Delete",
        description: "This category has products. Reassign them first.",
        variant: "destructive",
      });
      setIsDeleteModalOpen(false);
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    setIsDeleteModalOpen(false);
    toast({
      title: "Category Deleted",
      description: `${selectedCategory.name} has been successfully deleted.`,
    });
  };
  
  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    editForm.reset({
      name: category.name,
      parentId: category.parentId,
      description: category.description || "",
    });
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Category & Subcategory Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Category Name</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className="flex-shrink-0" 
                        style={{ width: `${getCategoryLevel(category) * 20}px` }}
                      ></div>
                      {hasSubcategories(category.id) && (
                        <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm">
                      {getCategoryPath(category)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{category.productCount}</TableCell>
                  <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => openDeleteModal(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          form.reset({
                            name: "",
                            parentId: category.id,
                            description: "",
                          });
                          setIsAddModalOpen(true);
                        }}
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new product category or subcategory.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""} 
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None (Top-level Category)</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {getCategoryPath(cat)}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter category description" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Modify category details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ""} 
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None (Top-level Category)</SelectItem>
                        {categories
                          .filter(cat => cat.id !== selectedCategory?.id && 
                                         !getSubcategories(selectedCategory?.id || "").some(s => s.id === cat.id))
                          .map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {getCategoryPath(cat)}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter category description" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
