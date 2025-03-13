import express from "express";
import {
  getAvailablePets,
  getPetDetail,
  getFavPets,
} from "../controllers/petController";
import tokenAuth from "../middlewares/tokenAuth";

const pet = express.Router();

pet.get("/getAvailablePets", getAvailablePets);
pet.get("/get-pet-data/:id", getPetDetail);
pet.post("/get-favPets", tokenAuth, getFavPets);

export default pet;
