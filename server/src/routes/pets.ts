import express from "express";
import { getAvailablePets, getPetDetail } from "../controllers/petController";

const pet = express.Router();

pet.get("/getAvailablePets", getAvailablePets);
pet.get("/get-pet-data/:id", getPetDetail);

export default pet;
