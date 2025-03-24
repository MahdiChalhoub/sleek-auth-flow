
import React from "react";

const DemoAccountsSection: React.FC = () => {
  return (
    <div className="mt-4 text-center text-sm">
      <p className="text-muted-foreground">
        Demo accounts:
      </p>
      <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md bg-muted p-1">
          admin@pos.com
        </div>
        <div className="rounded-md bg-muted p-1">
          manager@pos.com
        </div>
        <div className="rounded-md bg-muted p-1">
          cashier@pos.com
        </div>
      </div>
      <p className="mt-2 text-muted-foreground">
        Use any password (min 6 chars)
      </p>
    </div>
  );
};

export default DemoAccountsSection;
