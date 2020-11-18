import  { config } from "dotenv";
import { connect } from "mongoose";
import express from "express";
import cors from "cors";

config();

connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`, { useNewUrlParser: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(3000, ()=>{
    console.log('listen on port 3000')
});
