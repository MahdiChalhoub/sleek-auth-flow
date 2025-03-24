
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Computer, 
  ShoppingBasket, 
  Coffee, 
  Pizza, 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Utensils, 
  BookOpen, 
  Home, 
  Gamepad2,
  Baby
} from "lucide-react";

interface CategorySidebarProps {
  onSelectCategory: (category: string | null) => void;
  selectedCategory: string | null;
}

// Category items with icons
const categories = [
  { id: "all", name: "All Products", icon: Sparkles },
  { id: "electronics", name: "Electronics", icon: Computer },
  { id: "grocery", name: "Grocery", icon: ShoppingBasket },
  { id: "beverages", name: "Beverages", icon: Coffee },
  { id: "food", name: "Food", icon: Pizza },
  { id: "mobile", name: "Mobile Phones", icon: Smartphone },
  { id: "clothing", name: "Clothing", icon: Shirt },
  { id: "kitchenware", name: "Kitchenware", icon: Utensils },
  { id: "books", name: "Books", icon: BookOpen },
  { id: "home", name: "Home & Living", icon: Home },
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "baby", name: "Baby Care", icon: Baby },
];

const CategorySidebar = ({ onSelectCategory, selectedCategory }: CategorySidebarProps) => {
  return (
    <div className="w-56 border-r bg-background/50 backdrop-blur-sm h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="font-medium">Categories</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-9"
                onClick={() => onSelectCategory(category.id === "all" ? null : category.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="truncate">{category.name}</span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategorySidebar;
