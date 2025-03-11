// __mocks__/lucide-react.ts
import React from "react";

const createMockIcon = (name: string) =>
  function MockIcon(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-testid={`icon-${name}`} {...props} />;
  };

// Export commonly used icons or mock them dynamically
export const ChevronDown = createMockIcon("ChevronDown");
export const ChevronUp = createMockIcon("ChevronUp");
export const ChevronLeft = createMockIcon("ChevronLeft");
export const ChevronRight = createMockIcon("ChevronRight");
export const PawPrint = createMockIcon("PawPrint");
export const Filter = createMockIcon("Filter");
export const UserRound = createMockIcon("lucide-user-round");
export const Pencil = createMockIcon("lucide-pencil");
export const Search = createMockIcon("Search");
export const X = createMockIcon("X");
export const Heart = createMockIcon("Heart");
// Default export fallback if needed
export default {
  __esModule: true,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  PawPrint,
  Filter,
  UserRound,
  Pencil,
  Search,
  X,
  Heart,
};
