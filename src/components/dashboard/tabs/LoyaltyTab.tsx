
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { LoyaltyAndPromotionsSection } from "@/components/dashboard/LoyaltyAndPromotionsSection";

export const LoyaltyTab: React.FC = () => {
  return (
    <TabsContent value="loyalty" className="m-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty & Promotions</CardTitle>
          <CardDescription>Manage loyalty programs and promotional offers</CardDescription>
        </CardHeader>
        <CardContent>
          <LoyaltyAndPromotionsSection />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
