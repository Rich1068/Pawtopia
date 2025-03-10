// __mocks__/lucide-react.ts
import React from "react";

const createMockIcon = (name: string) =>
  function MockIcon(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-testid={`icon-${name}`} {...props} />;
  };

// Export commonly used icons or mock them dynamically
export const ChevronDown = createMockIcon("ChevronDown");
export const ChevronUp = createMockIcon("ChevronUp");
export const Filter = createMockIcon("Filter");
export const UserRound = createMockIcon("lucide-user-round");
export const Pencil = createMockIcon("lucide-pencil");

// Default export fallback if needed
export default {
  __esModule: true,
  ChevronDown,
  ChevronUp,
  Filter,
  UserRound,
  Pencil,
};
