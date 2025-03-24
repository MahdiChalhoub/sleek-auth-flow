
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { 
  Calendar, 
  CircleDollarSign, 
  Edit, 
  Gift, 
  MoreHorizontal, 
  Percent, 
  Plus, 
  Tag, 
  Trash, 
  Trophy, 
  Users 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LoyaltyAndPromotionsSection: React.FC = () => {
  const [showNewProgramDialog, setShowNewProgramDialog] = useState(false);
  const [showNewPromotionDialog, setShowNewPromotionDialog] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  const loyaltyPrograms = [
    {
      id: 1,
      name: "Regular Customer Rewards",
      pointsPerDollar: 1,
      minimumPoints: 500,
      pointValue: 0.01,
      activeMembers: 128,
      totalRedeemed: 2450,
      status: "Active"
    },
    {
      id: 2,
      name: "Premium Member Benefits",
      pointsPerDollar: 2,
      minimumPoints: 1000,
      pointValue: 0.015,
      activeMembers: 45,
      totalRedeemed: 1580,
      status: "Active"
    },
    {
      id: 3,
      name: "Holiday Bonus Points",
      pointsPerDollar: 3,
      minimumPoints: 750,
      pointValue: 0.01,
      activeMembers: 0,
      totalRedeemed: 0,
      status: "Inactive"
    }
  ];
  
  const promotions = [
    {
      id: 1,
      name: "Summer Sale",
      type: "Discount",
      value: 20,
      target: "Category",
      targetName: "Electronics",
      startDate: "2023-06-15",
      endDate: "2023-07-15",
      status: "Active",
      usageCount: 58
    },
    {
      id: 2,
      name: "Buy 2 Get 1 Free",
      type: "Quantity",
      value: 3,
      target: "Product",
      targetName: "T-Shirts",
      startDate: "2023-06-01",
      endDate: "2023-06-30",
      status: "Active",
      usageCount: 32
    },
    {
      id: 3,
      name: "Loyalty Member Discount",
      type: "Discount",
      value: 10,
      target: "Client Group",
      targetName: "Premium Members",
      startDate: "2023-05-01",
      endDate: "2023-12-31",
      status: "Active",
      usageCount: 95
    },
    {
      id: 4,
      name: "Easter Weekend Special",
      type: "Discount",
      value: 15,
      target: "Store Wide",
      targetName: "All Products",
      startDate: "2023-04-07",
      endDate: "2023-04-10",
      status: "Expired",
      usageCount: 210
    }
  ];
  
  const redeemHistory = [
    {
      id: 1,
      clientName: "John Smith",
      pointsRedeemed: 750,
      redeemValue: 7.50,
      date: "2023-06-20",
      program: "Regular Customer Rewards"
    },
    {
      id: 2,
      clientName: "Emily Johnson",
      pointsRedeemed: 1200,
      redeemValue: 18.00,
      date: "2023-06-18",
      program: "Premium Member Benefits"
    },
    {
      id: 3,
      clientName: "Michael Brown",
      pointsRedeemed: 500,
      redeemValue: 5.00,
      date: "2023-06-15",
      program: "Regular Customer Rewards"
    }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <>
      <Tabs defaultValue="programs" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="programs">Loyalty Programs</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="redeemed">Redeemed History</TabsTrigger>
          </TabsList>
          <div>
            <Button onClick={() => setShowNewProgramDialog(true)} className="mr-2">
              <Plus className="mr-2 h-4 w-4" />
              New Program
            </Button>
            <Button variant="outline" onClick={() => setShowNewPromotionDialog(true)}>
              <Tag className="mr-2 h-4 w-4" />
              New Promotion
            </Button>
          </div>
        </div>
        
        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loyaltyPrograms.map((program) => (
              <Card key={program.id} className={program.status === "Inactive" ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>
                        {program.pointsPerDollar} points per $1 spent
                      </CardDescription>
                    </div>
                    <Badge variant={program.status === "Active" ? "default" : "secondary"}>
                      {program.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Min. Points</p>
                        <p className="font-medium">{program.minimumPoints}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Point Value</p>
                        <p className="font-medium">${program.pointValue.toFixed(3)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Members</p>
                        <p className="font-medium">{program.activeMembers}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Redeemed</p>
                        <p className="font-medium">{program.totalRedeemed} pts</p>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 border-t">
                      <Button variant="ghost" size="sm">
                        <Users className="h-4 w-4 mr-1" />
                        Members
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promotion Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.name}</TableCell>
                    <TableCell>
                      {promo.type === "Discount" ? (
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 mr-1 text-purple-500" />
                          <span>Discount</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 mr-1 text-orange-500" />
                          <span>Quantity</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground block">
                        {promo.target}
                      </span>
                      {promo.targetName}
                    </TableCell>
                    <TableCell>
                      {promo.type === "Discount" 
                        ? `${promo.value}% off` 
                        : `Buy ${promo.value - 1} Get 1 Free`
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="text-xs">
                          {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        promo.status === "Active" 
                          ? "default" 
                          : promo.status === "Expired" 
                            ? "secondary" 
                            : "outline"
                      }>
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{promo.usageCount} uses</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Assigned To
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="redeemed" className="space-y-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead className="text-right">Points Redeemed</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redeemHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.clientName}</TableCell>
                    <TableCell>{item.program}</TableCell>
                    <TableCell className="text-right">{item.pointsRedeemed}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.redeemValue)}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* New Loyalty Program Dialog */}
      <Dialog open={showNewProgramDialog} onOpenChange={setShowNewProgramDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Loyalty Program</DialogTitle>
            <DialogDescription>
              Set up a new loyalty program for your customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Program Name</p>
              <Input placeholder="Enter program name..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Points Per Dollar</p>
                <Input type="number" min="0.1" step="0.1" placeholder="1" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Point Value ($)</p>
                <Input type="number" min="0.001" step="0.001" placeholder="0.01" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Minimum Redemption</p>
                <Input type="number" min="1" placeholder="500 points" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Expiry</p>
                <Select defaultValue="never">
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiry period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never Expire</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewProgramDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowNewProgramDialog(false)}>
              Create Program
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Promotion Dialog */}
      <Dialog open={showNewPromotionDialog} onOpenChange={setShowNewPromotionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
            <DialogDescription>
              Set up a new promotional offer for your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Promotion Name</p>
              <Input placeholder="Enter promotion name..." />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Promotion Type</p>
              <Select defaultValue="discount">
                <SelectTrigger>
                  <SelectValue placeholder="Select promotion type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Percentage Discount</SelectItem>
                  <SelectItem value="quantity">Buy X Get Y Free</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Value</p>
                <Input type="number" min="1" placeholder="e.g. 20% off" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Target</p>
                <Select defaultValue="category">
                  <SelectTrigger>
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store">Store Wide</SelectItem>
                    <SelectItem value="category">Product Category</SelectItem>
                    <SelectItem value="product">Specific Product</SelectItem>
                    <SelectItem value="client">Client Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Start Date</p>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">End Date</p>
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewPromotionDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowNewPromotionDialog(false)}>
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
