// __mocks__/lucide-react.ts
import React from "react";

const createMockIcon =
  (name: string) => (props: React.HTMLAttributes<HTMLDivElement>) => {
    return <div data-testid={`icon-${name}`} {...props} />;
  };
// Export commonly used icons or mock them dynamically
export const ArrowLeft = createMockIcon("ArrowLeft");
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
export const Eye = createMockIcon("Eye");
export const Edit = createMockIcon("Edit");
export const Trash = createMockIcon("Trash");
export const Minus = createMockIcon("Minus");
export const Plus = createMockIcon("Plus");
export const Check = createMockIcon("Check");
export const LoaderCircle = createMockIcon("LoaderCircle");
export const DollarSign = createMockIcon("DollarSign");
export const ShoppingCart = createMockIcon("ShoppingCart");
export const Clock = createMockIcon("Clock");
export const Menu = createMockIcon("Menu");
export const Store = createMockIcon("Store");
export const LayoutGrid = createMockIcon("LayoutGrid");
export const LogOut = createMockIcon("LogOut");
export const Mail = createMockIcon("Mail");
export const ShoppingBag = createMockIcon("ShoppingBag");
export const ArrowUp = createMockIcon("ArrowUp");
export const ArrowDown = createMockIcon("ArrowDown");
export const ArrowUpDown = createMockIcon("ArrowUpDown");
export const Archive = createMockIcon("Archive");
// Default export fallback if needed
export default {
  __esModule: true,
  ArrowLeft,
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
  Eye,
  Edit,
  Trash,
  Minus,
  Plus,
  Check,
  LoaderCircle,
  DollarSign,
  ShoppingCart,
  Clock,
  Menu,
  Store,
  LayoutGrid,
  LogOut,
  Mail,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Archive,
};
