import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({message:'Unauthorized'});

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if(err) return res.status(403).json({message:'Error Verifying Token'});
        const temp = await User.findById(user.id);
        req.user = temp;
        next();
    })
}

export default authenticateToken;