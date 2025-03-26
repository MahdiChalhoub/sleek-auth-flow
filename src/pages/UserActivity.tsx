
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserActivity = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Activité Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Le suivi des activités utilisateurs sera bientôt disponible.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;
