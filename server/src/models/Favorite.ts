import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: String, // Associate favorites with a user
  petId: String,
  petName: String,
  petImage: String,
});

export default mongoose.model("Favorite", favoriteSchema);
