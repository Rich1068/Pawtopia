import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import route from './routes/routes';
import dotenv from 'dotenv';
import db_connection from './db-config';
import auth from './routes/auth';
import pet from './routes/pets';
import user from './routes/user';
import swaggerUI from 'swagger-ui-express'
import petstoreApi from '../petstoreapi.json'
db_connection()
dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', route)
app.use('/api', auth)
app.use('/pet', pet)
app.use('/user', user)
app.use('/api/v3', swaggerUI.serve, swaggerUI.setup(petstoreApi))
const port = process.env.PORT || 8000;
app.listen(port, ()=> {
    console.log('Backend Server running at Port: ' + port)
})