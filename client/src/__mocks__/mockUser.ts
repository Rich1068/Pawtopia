import { User } from "../types/Types";

export const mockUser: User = {
  _id: "123",
  name: "John",
  email: "john@example.com",
  phoneNumber: "1234567890",
  role: "user" as "user" | "admin",
  createdAt: new Date("2023-01-01T00:00:00Z"),
  profileImage: "/default-profile.jpg",
};
