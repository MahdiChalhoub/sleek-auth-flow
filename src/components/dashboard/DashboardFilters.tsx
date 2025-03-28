
import React from "react";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  cashier: string;
  setCashier: React.Dispatch<React.SetStateAction<string>>;
  register: string;
  setRegister: React.Dispatch<React.SetStateAction<string>>;
  product: string;
  setProduct: React.Dispatch<React.SetStateAction<string>>;
  category: string; // Adding this missing property
  setCategory: React.Dispatch<React.SetStateAction<string>>; // Adding this missing property
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  dateRange,
  setDateRange,
  cashier,
  setCashier,
  register,
  setRegister,
  product,
  setProduct,
  category, // Adding this missing property
  setCategory, // Adding this missing property
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Filter dashboard data by date range, cashier, register, or products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Date Range</p>
            <DatePickerWithRange 
              date={dateRange} 
              setDate={setDateRange}
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Cashier</p>
            <Select value={cashier} onValueChange={setCashier}>
              <SelectTrigger>
                <SelectValue placeholder="Select cashier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cashiers</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="robert">Robert Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Register</p>
            <Select value={register} onValueChange={setRegister}>
              <SelectTrigger>
                <SelectValue placeholder="Select register" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Registers</SelectItem>
                <SelectItem value="pos1">POS 1</SelectItem>
                <SelectItem value="pos2">POS 2</SelectItem>
                <SelectItem value="pos3">POS 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Product/Category</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products or categories..."
                className="pl-8"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
