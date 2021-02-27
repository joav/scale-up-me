import  { config } from "dotenv";
import express from "express";
import cors from "cors";
import db from './db';

config();
db();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(3000, ()=>{
    console.log('listen on port 3000')
});
