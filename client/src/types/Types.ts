interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export interface Pet {
  id: number;
  name: string;
  category: Category;
  photoUrls: string[];
  tags: Tag[];
  status: "available" | "pending" | "sold"; // Based on Petstore API status values
}

export interface Selection {
  selected: {
    dog: boolean;
    cat: boolean;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<{
      dog: boolean;
      cat: boolean;
    }>
  >;
}

export interface UserJWT {
  id: string;
  name: string;
  role: "user" | "admin";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  createdAt: Date;
  profileImage: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  verifyToken: () => Promise<
    | {
        success: boolean;
        user?: undefined;
      }
    | {
        success: boolean;
        user: User;
      }
  >;
  login: (rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

export interface PetFilter {
  species: string[];
  age: string[];
  size: string[];
  gender: string[];
}
export interface PetCounts {
  species: { dog: number; cat: number };
  age: { young: number; adult: number; senior: number };
  size: { small: number; medium: number; large: number; xlarge: number };
  gender: { male: number; female: number };
}
export type Pets = Pet[]; // Array of pets

export interface FavoritePets {
  userId: string;
  petId: string;
  petImage: string;
  petName: string;
}

export interface IAdminLayout {
  isExpanded: boolean;
  setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IProduct {
  _id: string;
  images: string[];
  name: string;
  description: string;
  price: string;
  category: string[];
  isArchived?: boolean;
}

export interface IAddProduct extends Omit<IProduct, "_id"> {
  _id?: string;
  description: string;
}

export interface IProductImage {
  preview: string;
  file?: File;
  isNew: boolean;
}
export type ProductFilter = {
  category: string[];
};
export type ProductCounts = {
  category: Record<string, number>;
};

export interface ICartProduct {
  _id: string | null | undefined;
  productId: IProduct | null;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  products: ICartProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrderProduct {
  productId: string | null;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id?: string;
  userId: string | IUser;
  products: IOrderProduct[];
  orderId: string;
  paymentId?: string;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email?: string;
}

export interface IAdoptRequest {
  _id: string;
  petName: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  name: string;
  livingSituation: string;
  mode: string;
  phone: string;
  email: string;
  address: string;
}
