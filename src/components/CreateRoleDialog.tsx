
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPermission } from "@/types/auth";

// Form schema
const roleFormSchema = z.object({
  name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
  description: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface CreateRoleDialogProps {
  onCreateRole: (role: { name: string, description: string, permissions: UserPermission[] }) => void;
  existingPermissions: UserPermission[];
}

const CreateRoleDialog: React.FC<CreateRoleDialogProps> = ({ onCreateRole, existingPermissions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<UserPermission[]>(
    existingPermissions.map(p => ({ ...p, enabled: false }))
  );

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // Get unique permission categories
  const categories = [...new Set(permissions.map(p => p.category || 'Other'))];

  const handleSubmit = async (values: RoleFormValues) => {
    setIsSubmitting(true);
    
    try {
      await onCreateRole({
        name: values.name,
        description: values.description || "",
        permissions,
      });
      
      // Reset form
      form.reset();
      setPermissions(existingPermissions.map(p => ({ ...p, enabled: false })));
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePermission = (permissionId: string, enabled: boolean) => {
    setPermissions(permissions.map(permission => 
      permission.id === permissionId ? { ...permission, enabled } : permission
    ));
  };

  const handleToggleCategory = (category: string, enabled: boolean) => {
    setPermissions(permissions.map(permission => 
      permission.category === category ? { ...permission, enabled } : permission
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="mt-4 flex justify-center">
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Role
          </Button>
        </DialogTrigger>
      </div>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with custom permissions. Roles define what actions users can perform in the system.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Role Details</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Store Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe this role's responsibilities and privileges" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="permissions" className="pt-4">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    Select the permissions for this role. You can click on a category to expand and see specific permissions.
                  </div>
                  
                  <Accordion type="multiple" className="space-y-2">
                    {categories.map(category => {
                      const categoryPermissions = permissions.filter(p => p.category === category);
                      const allEnabled = categoryPermissions.every(p => p.enabled);
                      const someEnabled = categoryPermissions.some(p => p.enabled);
                      
                      return (
                        <AccordionItem key={category} value={category} className="border rounded">
                          <div className="flex items-center px-4 py-2">
                            <Checkbox 
                              id={`category-${category}`}
                              checked={allEnabled}
                              onCheckedChange={(checked) => {
                                handleToggleCategory(category, checked === true);
                              }}
                              className="mr-2"
                              aria-label={`Toggle all ${category} permissions`}
                            />
                            <AccordionTrigger className="hover:no-underline flex-1">
                              <div className="flex items-center justify-between w-full">
                                <label 
                                  htmlFor={`category-${category}`}
                                  className="flex-1 text-sm font-medium"
                                >
                                  {category}
                                </label>
                                <span className="text-xs text-muted-foreground">
                                  {categoryPermissions.filter(p => p.enabled).length} of {categoryPermissions.length}
                                </span>
                              </div>
                            </AccordionTrigger>
                          </div>
                          <AccordionContent className="px-4 pb-3 pt-1">
                            <div className="space-y-2">
                              {categoryPermissions.map(permission => (
                                <div key={permission.id} className="flex items-start space-x-2">
                                  <Checkbox 
                                    id={permission.id}
                                    checked={permission.enabled}
                                    onCheckedChange={(checked) => {
                                      handleTogglePermission(permission.id, checked === true);
                                    }}
                                    className="mt-1"
                                  />
                                  <div className="grid gap-1">
                                    <label
                                      htmlFor={permission.id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {permission.name}
                                    </label>
                                    {permission.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {permission.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Creating...
                  </>
                ) : (
                  'Create Role'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleDialog;
