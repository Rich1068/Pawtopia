# Pawtopia 🐾 
<hr>
Pawtopia is a comprehensive pet platform that combines an ePet Shop and an Adoption Center to connect pet lovers with their perfect companions. Whether you're looking to buy pet supplies or adopt a furry friend, Pawtopia makes the process simple and enjoyable.

### Features:
* User authentication and authorization with JWT 
* Profile Managment
* Display pets for adoption (Admin)
* Display pet products for sale (Admin)
* Users can view products and pets and their respective information with the option to adopt/buy
* Users can search, filter, sort products/pets
* And More.



## Built With

### Front-End:

* [![React][React.js]][React-url]
* [![TailwindCSS][tailwind]][tailwind-url]

### Back-End:
* [![Express.js][expressJS]][express-url]
* [![NodeJS][nodejs]][nodejs-url]
* [![Swagger][swagger]][swagger-url]
* [![MongoDB][mongodb]][mongodb-url]

### Testing:
* [![Playwright][playwright]][playwright-url]


## Getting Started

Steps on how to run Locally

### Installation
1. Get a DB connection key from MongoDB Atlas
2. Clone or Download the repository
3. Install client npm packages
   ```sh
   cd client/
   npm install
   ```
5. Rename the .env.example on client folder to .env and add the keys
    ```sh
    BASE_URL = url here
    ```

6. Install server npm packages
   ```sh
   cd server/
   npm install
   ```
7. Rename the .env.example on server folder to .env and add the keys
   ```sh
   ...
   DB_CONNECTION = MongoDB connection key
   ...
   ```
8. Run the client 
    ```sh
    cd client/
    npm run dev
    ```
9. Run the server on another terminal
    ```sh
    cd server/
    npm run dev
    ```
10. Run the API on another terminal
    ```sh
    cd swagger-petstore/
    mvn jetty:run
    ```
    

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[tailwind]:https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]:https://tailwindcss.com/


[expressJS]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[express-url]: https://expressjs.com/

[mongodb]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://www.mongodb.com/

[nodejs]:https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]:https://nodejs.org/en

[swagger]:https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white
[swagger-url]:https://petstore3.swagger.io/

[playwright]:https://img.shields.io/badge/-playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white
[playwright-url]: https://playwright.dev/