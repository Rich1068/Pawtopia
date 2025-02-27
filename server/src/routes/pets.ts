import express from "express";
import getAvailablePets from "../controllers/petController";
const pet = express.Router();

pet.get("/getAvailablePets", getAvailablePets);

export default pet;
