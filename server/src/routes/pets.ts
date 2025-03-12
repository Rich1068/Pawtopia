import express from "express";
import {
  getAvailablePets,
  getPetDetail,
  getFavPets,
} from "../controllers/petController";

const pet = express.Router();

pet.get("/getAvailablePets", getAvailablePets);
pet.get("/get-pet-data/:id", getPetDetail);
pet.post("/get-favPets", getFavPets);

export default pet;
