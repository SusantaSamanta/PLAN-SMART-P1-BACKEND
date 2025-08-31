import express from 'express';
const app = express();

import 'dotenv/config';
import cors from 'cors';

import { authRoutes } from './routes/authRoutes.js';


app.use(express.json());
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        exposedHeaders: ['X-Total-Count'],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }
));



app.get('/', (req, res) => {
    res.send("Hello server is running.....")
});



//////  Routes section /////


app.use('/api/user/auth', authRoutes);







const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`sever run on http://localhost:${PORT}`);
})