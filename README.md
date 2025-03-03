# Pawtopia 🐾

<hr>
Pawtopia is a comprehensive pet platform that combines an ePet Shop and an Adoption Center to connect pet lovers with their perfect companions. Whether you're looking to buy pet supplies or adopt a furry friend, Pawtopia makes the process simple and enjoyable.

### Features:

- User authentication and authorization with JWT
- Profile Managment
- Display pets for adoption
- Display pet products for sale (Admin)
- Users can view products and pets and their respective information with the option to adopt/buy
- Users can search, filter, sort products/pets
- And More.

## Built With

### Front-End:

- [![React][React.js]][React-url]
- [![TailwindCSS][tailwind]][tailwind-url]

### Back-End:

- [![Express.js][expressJS]][express-url]
- [![NodeJS][nodejs]][nodejs-url]
- [![MongoDB][mongodb]][mongodb-url]

### Testing:

- [![Playwright][playwright]][playwright-url]

## Getting Started

Steps on how to run Locally

### Installation

1. Get a DB connection key from MongoDB Atlas
2. Clone or Download the repository
3. Install client npm packages

   ```console
   cd client/
   npm install
   ```

4. Rename the .env.example on client folder to .env and add the keys

   ```console
   BASE_URL = http://localhost:5173
   ```

5. Install server npm packages

   ```console
   cd server/
   npm install
   ```

6. Rename the .env.example on server folder to .env and add the keys
   ```console
   ...
   DB_CONNECTION = MongoDB connection key
   ...
   ```
7. Run the client

   ```console
   cd client/
   npm run dev
   ```

8. Run the server on another terminal
   ```console
   cd server/
   npm run dev
   ```

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
[playwright]: https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white
[playwright-url]: https://playwright.dev/
