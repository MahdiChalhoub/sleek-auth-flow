
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useScreenSize } from "@/hooks/use-mobile";
import { Search, BarcodeScan, FileSearch, ArrowLeftRight } from "lucide-react";

const Returns: React.FC = () => {
  const { isMobile } = useScreenSize();
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Returns & Exchanges</h1>
        <p className="text-muted-foreground">Process customer returns and exchanges</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Find Transaction</CardTitle>
              <CardDescription>
                Search for a transaction to process a return
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search by receipt number or customer name"
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <BarcodeScan size={16} />
                    <span>Scan Receipt</span>
                  </Button>
                  <Button className="gap-2">
                    <FileSearch size={16} />
                    <span>Search</span>
                  </Button>
                </div>
                
                <div className="rounded-lg border bg-card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
                  <div className="mb-4">
                    <ArrowLeftRight size={48} className="text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-medium">No Transaction Selected</p>
                  <p className="text-muted-foreground">Search for a transaction to begin the return process</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Return Summary</CardTitle>
              <CardDescription>
                Return details and refund information
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="rounded-lg border bg-card p-6 text-center h-[300px] flex flex-col items-center justify-center">
                <p className="text-muted-foreground">Select transaction to view return summary</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost">Cancel</Button>
              <Button disabled>Process Return</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Returns;
