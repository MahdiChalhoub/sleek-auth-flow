
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import AuditTrailList from "@/components/audit/AuditTrailList";

const AuditTrail: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Système de suivi des activités</h1>
      <Card>
        <CardContent className="pt-6">
          <AuditTrailList />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
