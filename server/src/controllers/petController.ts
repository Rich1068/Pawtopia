import { Response, Request } from "express";
import axios from "axios";

export const getAvailablePets = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page } = req.query;
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

export default { getAvailablePets, getPetDetail };
