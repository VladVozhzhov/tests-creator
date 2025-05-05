const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).json({ message: 'No refresh token' }); // Unauthorized
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) return res.status(403).json({ message: 'User not found with jwt'}); // Forbidden
    
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token', details: err.message});
            if (foundUser.username !== decoded.UserInfo.username) return res.status(403).json({ message: 'Username does not match' }); //Forbidden
            
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "_id": decoded.UserInfo._id,
                        "username": decoded.UserInfo.username
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'None' : 'Lax',
                maxAge: 30 * 60 * 1000 // 30 min
            });
            
            res.json({ accessToken });
        }
    );
}

module.exports = { handleRefreshToken };