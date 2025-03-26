
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Expenses = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>La fonctionnalité de gestion des dépenses sera bientôt disponible.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
