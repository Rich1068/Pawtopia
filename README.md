# 🐾 Pawtopia

**Pawtopia** is a full-featured pet care platform that combines an **ePet Shop** and an **Adoption Center**, making it easier than ever for pet lovers to find everything they need—from pet supplies to their future furry companions.
https://pawtopia-rust.vercel.app/

## ✨ Features

- 🔐 **Secure Authentication & Authorization**  
  JWT-based user login and registration for protected access

- 👤 **User Profile Management**  
  Update personal details and profile images with ease

- 🐶 **Pet Adoption Center**  
  Browse adoptable pets with detailed descriptions and images

- 🛒 **Pet Products Store**  
  Admins can add/edit pet products; users can browse and purchase

- 🔎 **Smart Search, Filters & Sorting**  
  Easily find pets or products using category, keywords, and other filters

- ❤️ **Favorites & Order/Adoption History**  
  Save favorite pets and view past activity

- 💳 **Stripe Checkout Integration**  
  Secure and smooth payment experience with real-time order creation

- ☁️ **Image Upload with Cloudinary**  
  Product and profile image uploads with cloud storage support

- 📱 **Responsive Design**  
  Optimized UI for both desktop and mobile devices

## 💡 Why Pawtopia?

Whether you’re looking to adopt a pet or shop for your current companion, **Pawtopia** provides a seamless, heartwarming, and user-friendly experience — all in one place.

## Built With

### Front-End:

[![React][React.js]][React-url]

[![TailwindCSS][tailwind]][tailwind-url]

### Back-End:

[![Express.js][expressJS]][express-url]

[![NodeJS][nodejs]][nodejs-url]

[![MongoDB][mongodb]][mongodb-url]

### Testing:

[![Jest][jest]][jest-url]

## Getting Started

Steps on how to run Locally

### Installation

How to get the Keys:

- ##### DB connection key: from MongoDB Atlas by registering an account on https://www.mongodb.com/products/platform/atlas-database and creating a database
- ##### SMTP Gmail ACC and PASS: ACC is the email that you will use to send emails to users and PASS is the app passoword from gmail
- ##### STRIPE SECRET, WEBHOOK KEY: Create an account in STRIPE and get the secret key from there. As for the Webhook key follow this document https://docs.stripe.com/webhooks
- ##### API-KEY: This is the API key for the rescuegroup api. Fill up this form to receive the key https://rescuegroups.org/services/request-an-api-key/
- ##### Cloudinary NAME, KEY, and SECRET: Create a Cloudinary account and get your keys on the API keys page

  1. Clone or Download the repository

  2. Install client npm packages

  ```console
  cd client/
  npm install
  ```

  3. Rename the .env.example on client folder to .env and add the keys

  ```console
  BASE_URL = http://localhost:5173
  ```

  4. Install server npm packages

  ```console
  cd server/
  npm install
  ```

  5. Rename the .env.example on server folder to .env and add the keys

  ```console
  ...
  DB_CONNECTION = MongoDB connection key
  ...
  ```

  6. Run the client

  ```console
  cd client/
  npm run dev
  ```

  7. Run the server on another terminal

  ```console
  cd server/
  npm run dev
  ```

  8.  you can now visit localhost:5173 to see if all are running without errors

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[tailwind]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[expressJS]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[express-url]: https://expressjs.com/
[mongodb]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://www.mongodb.com/
[nodejs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/en
[jest]: https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white
[jest-url]: https://jestjs.io/
