
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Branch } from "@/models/interfaces/businessInterfaces";

interface ModificationRequestListProps {
  currentLocation?: Branch | null;
}

const ModificationRequestList: React.FC<ModificationRequestListProps> = ({ currentLocation }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modification Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {currentLocation ? (
          <p>No modification requests for {currentLocation.name}</p>
        ) : (
          <p>Please select a location to view modification requests</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModificationRequestList;
