
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Notifications: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-muted-foreground">Just now</p>
              <p className="font-medium">New inventory items have been added</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="text-sm text-muted-foreground">2 hours ago</p>
              <p className="font-medium">Sales report is ready for review</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4 py-2">
              <p className="text-sm text-muted-foreground">Yesterday</p>
              <p className="font-medium">Low stock alert: 5 products require attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
