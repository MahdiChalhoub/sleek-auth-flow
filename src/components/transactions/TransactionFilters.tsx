
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Building, Calendar, Search, ArrowUpDown } from "lucide-react";
import { TransactionStatus } from "@/models/transaction";

interface TransactionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: TransactionStatus | "all";
  setStatusFilter: (status: TransactionStatus | "all") => void;
  branchFilter: string;
  setBranchFilter: (branch: string) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;
  branches: { id: string; name: string }[];
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  branchFilter,
  setBranchFilter,
  sortDirection,
  setSortDirection,
  branches
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 glass-input"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TransactionStatus | "all")}
        >
          <SelectTrigger className="w-[160px] glass-input">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="secure">Secure</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={branchFilter}
          onValueChange={(value) => setBranchFilter(value)}
        >
          <SelectTrigger className="w-[160px] glass-input">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <SelectValue placeholder="Filter by branch" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          className="glass-input"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
