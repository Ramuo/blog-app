
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import connectDB from './config/db.js'
import {notFound, errorHandler} from './middleware/errorMiddleware.js';

//ROUTES
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import messgeRoutes from './routes/messageRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


const port = process.env.PORT || 5000;

//CONNECT TO MongoDB
connectDB();

//INITIALIZE EXPRESS
const app = express();

// Bordy parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parsr middleware
app.use(cookieParser());


//ROUTES

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/message', messgeRoutes);
app.use('/api/category', categoryRoutes);



//MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

//SERVER
app.listen(port, () => console.log(`Server running on port ${port}`));


