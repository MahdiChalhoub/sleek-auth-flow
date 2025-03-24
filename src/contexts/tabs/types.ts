
import React from "react";

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ElementType;
  state?: Record<string, any>;
}
