import { IProduct } from "../types/Types";

export const mockProducts: IProduct[] = [
  {
    _id: "1",
    name: "Premium Dog Food",
    category: ["Dog Supplies"],
    images: ["dog_food.jpeg", "dog_food2.jpeg"],
    description: "Healthy food for dogs",
    price: "25",
  },
  {
    _id: "2",
    name: "Cat Scratching Post",
    category: ["Cat Supplies"],
    images: ["scratching_post.jpeg"],
    description: "Durable scratching post for cats",
    price: "40",
  },
  {
    _id: "3",
    name: "Dog Chew Toy",
    category: ["Dog Supplies"],
    images: ["dog_toy.jpeg"],
    description: "Fun chew toy for dogs",
    price: "15",
  },
  {
    _id: "4",
    name: "Cat Litter Box",
    category: ["Cat Supplies"],
    images: ["litter_box.jpeg"],
    description: "Easy-to-clean litter box for cats",
    price: "30",
  },
  {
    _id: "5",
    name: "Cat Toy",
    category: ["Cat Supplies"],
    images: [],
    description: "Best Cat Toy in the shop",
    price: "40",
  },
];

export const mockProduct: IProduct = {
  _id: "1",
  name: "Premium Dog Food",
  category: ["Dog Supplies"],
  images: ["dog_food.jpeg"],
  description: "Healthy food for dogs",
  price: "25",
};
