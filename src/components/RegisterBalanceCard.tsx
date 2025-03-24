
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RegisterBalanceCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

const RegisterBalanceCard = ({ title, value, icon, className }: RegisterBalanceCardProps) => {
  return (
    <Card className={cn("shadow-sm overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xl font-semibold">${value.toFixed(2)}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterBalanceCard;
