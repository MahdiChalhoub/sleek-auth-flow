
import React, { useState } from "react";
import { ChevronDown, ChevronRight, FolderIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Category } from "@/hooks/useCategoryTree";

interface CategoryTreeProps {
  categories: Category[];
  onSelectCategory?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onSelectCategory,
  selectedCategoryId,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedIds(newExpanded);
  };

  const handleSelectCategory = (category: Category) => {
    if (onSelectCategory) {
      onSelectCategory(category.id);
    }
  };

  const renderCategories = (nodes: Category[], level = 0) => {
    return nodes.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedIds.has(category.id);
      const isSelected = selectedCategoryId === category.id;

      return (
        <div key={category.id} className={`ml-${level * 4}`}>
          <div className="flex items-center">
            {hasChildren ? (
              <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
                <div className="flex items-center py-1 group w-full">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1 text-muted-foreground">
                      {isExpanded ? 
                        <ChevronDown className="h-4 w-4 transition-transform" /> : 
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  
                  <div 
                    className={`flex-1 flex items-center py-1 px-2 rounded-md transition-colors cursor-pointer ${
                      isSelected ? "bg-muted font-medium" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleSelectCategory(category)}
                  >
                    <FolderIcon className="h-4 w-4 mr-2 text-amber-500" />
                    <span>{category.name}</span>
                    {/* Conditionally show count badge if it exists */}
                    {category.count !== undefined && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CollapsibleContent className="pl-6 pt-1 overflow-hidden">
                  {hasChildren && renderCategories(category.children, level + 1)}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div 
                className={`flex items-center py-1 pl-6 pr-2 rounded-md transition-colors cursor-pointer ${
                  isSelected ? "bg-muted font-medium" : "hover:bg-muted/50"
                }`}
                onClick={() => handleSelectCategory(category)}
              >
                <File className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{category.name}</span>
                {/* Conditionally show count badge if it exists */}
                {category.count !== undefined && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-1 w-full overflow-hidden">
      {renderCategories(categories)}
    </div>
  );
};

export default CategoryTree;
