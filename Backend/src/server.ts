import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db';
import cookieParser from 'cookie-parser'
import cors from "cors"
import corsOptions from "./config/corsOptions";
import credentials from './middleware/credentials';

import authRouter from './routes/authRoute'
import messageRouter from './routes/messageRoute'
import { app, server } from './lib/socket';

dotenv.config();
const port = process.env.PORT;

app.use(credentials);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

server.listen(port, () => {
    console.log(`The server is running on port: ${port}`)
    connectDB();
})