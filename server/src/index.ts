import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import route from "./routes/routes";
import dotenv from "dotenv";
import db_connection from "./db-config";
import auth from "./routes/auth";
import pet from "./routes/pets";
import user from "./routes/user";
import path from "path";
import email from "./routes/email";
import product from "./routes/product";
import cart from "./routes/cart";
import { handleCheckoutSuccess } from "./controllers/cartController";
import order from "./routes/order";
import adopt from "./routes/adopt";
import admin from "./routes/admin";

db_connection();
dotenv.config();
const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL!, "https://checkout.stripe.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleCheckoutSuccess
);
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/", route);
app.use("/api", auth);
app.use("/pet", pet);
app.use("/user", user);
app.use("/email", email);
app.use("/product", product);
app.use("/cart", cart);
app.use("/order", order);
app.use("/adopt", adopt);
app.use("/admin", admin);
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Backend Server running at Port: " + port);
});
