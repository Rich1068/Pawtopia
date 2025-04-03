import { IOrder } from "../types/Types";

export const mockOrders: IOrder[] = [
  {
    orderId: "ORD123",
    createdAt: "2023-01-01T00:00:00Z",
    totalAmount: 99.99,
    userId: "1",
    products: [
      { productId: "1", name: "Product 1", price: 29.99, quantity: 2 },
      { productId: "2", name: "Product 2", price: 39.99, quantity: 1 },
    ],
  },
  {
    orderId: "ORD456",
    createdAt: "2023-01-02T00:00:00Z",
    totalAmount: 59.99,
    userId: "1",
    products: [
      { productId: "3", name: "Product 3", price: 19.99, quantity: 3 },
    ],
  },
];

export const mockOrder: IOrder = {
  orderId: "ORD123",
  createdAt: "2023-05-15T10:30:00Z",
  userId: "1",
  totalAmount: 99.99,
  products: [
    {
      productId: "1",
      name: "Test Product 1",
      price: 29.99,
      quantity: 2,
    },
    {
      productId: "2",
      name: "Test Product 2",
      price: 39.99,
      quantity: 1,
    },
  ],
};
