import { Response, Request } from "express";
import axios from "axios";

export const getAvailablePets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.get(
      "https://api.rescuegroups.org/v5/public/animals/search/available/haspic/isneedingfoster/?limit=250",
      {
        headers: {
          Authorization: "zKb4tfPS",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("something wrong" + error);
  }
};
export const getPetDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `https://api.rescuegroups.org/v5/public/animals/${id}`,
      {
        headers: {
          Authorization: "zKb4tfPS",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("something wrong" + error);
  }
};

export const getFavPets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { petIds } = req.body;
  try {
    if (!petIds || petIds.length === 0) {
      res.status(400).json({ error: "No pet IDs provided" });
      return;
    }

    const petPromises = petIds.map((id: string) =>
      axios.get(`https://api.rescuegroups.org/v5/public/animals/${id}`, {
        headers: {
          Authorization: "zKb4tfPS",
        },
      })
    );

    const petResponses = await Promise.all(petPromises);
    const pets = petResponses.map((response) => response.data.data).flat();
    res.json({ pets });
  } catch (error) {
    console.error("Failed to fetch pets", error);
    res.status(500).json({ error: "Failed to fetch pet data" });
  }
};

export default { getAvailablePets, getPetDetail, getFavPets };
