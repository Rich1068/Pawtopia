import { useParams } from "react-router";
import serverAPI from "../helper/axios";
import { useQuery } from "@tanstack/react-query";
import { petType } from "../types/pet";

//Adopt.tsx
export const useAllPets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const { data } = await serverAPI.get("/pet/getAvailablePets");
      return data.data as petType[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

//PetPage.tsx
export const usePetData = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: ["petData", id],
    queryFn: async () => {
      const { data } = await serverAPI.get(`pet/get-pet-data/${id}`);
      return data.data?.[0] || null;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });
};
