
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircleUser, Clock, CalendarClock } from "lucide-react";
import { Register } from "@/models/interfaces/registerInterfaces";

interface RegisterMetaCardProps {
  register: Register;
}

const RegisterMetaCard: React.FC<RegisterMetaCardProps> = ({ register }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{register.name}</h2>
        
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-full">
              <CircleUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Operator</p>
              <p className="font-medium">{register.openedBy || "Not assigned"}</p>
            </div>
          </li>
          
          <li className="flex items-center gap-2">
            <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-full">
              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Opened At</p>
              <p className="font-medium">{formatDate(register.openedAt)}</p>
            </div>
          </li>
          
          {register.closedAt && (
            <li className="flex items-center gap-2">
              <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded-full">
                <CalendarClock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Closed At</p>
                <p className="font-medium">{formatDate(register.closedAt)}</p>
              </div>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RegisterMetaCard;
