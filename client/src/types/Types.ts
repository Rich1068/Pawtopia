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
  login: () => Promise<boolean>;
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
