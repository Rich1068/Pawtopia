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
      dog:boolean; 
      cat: boolean
    }
    setSelected: React.Dispatch<React.SetStateAction<{
      dog: boolean;
      cat: boolean;
  }>>
  }
  export type Pets = Pet[]; // Array of pets
