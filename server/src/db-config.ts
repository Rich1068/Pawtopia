import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const db_connection = () => {
    if(process.env.DB_CONNECTION) {
        const connection_DB = mongoose.connect(process.env.DB_CONNECTION)
        .then(()=>console.log('Database connected'))
        .catch((err)=>{
            console.log('Database not connected ' + err)
        })
        return connection_DB
    } else {
        console.error('No DB key on ENV')
    }
}
export default db_connection