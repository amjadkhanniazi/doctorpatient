import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import userRoutes from './route/auth.js';
import perRoutes from './route/perAPI.js';
import appAPI from './route/appAPI.js';
import path from 'path';
import { fileURLToPath } from 'url';
import profile from './route/profile.js';


const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

connectDB();

const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);         // Get the directory name

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





app.use('/auth', userRoutes);
app.use('/per', perRoutes);
app.use('/appointment', appAPI);
app.use('/profile', profile);


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});