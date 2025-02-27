import { Response, Request } from "express";
import axios from "axios";

export const getAvailablePets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.get(
      "http:localhost:8080/api/v3/pet/findByStatus?status=available",
      {
        headers: {
          api_key: "pet-store-api",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log("something wrong" + error);
  }
};

export default getAvailablePets;
