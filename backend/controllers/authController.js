const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../model/User');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const handleAuth = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.status(404).json({ message: 'User not found' });
    
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: 'Password does not match' });
    
    const accessToken = jwt.sign(
        {
            UserInfo: {
                username: foundUser.username,
                _id: foundUser._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' }
    );
    
    const refreshToken = jwt.sign(
        {
            UserInfo: {
                username: foundUser.username,
                _id: foundUser._id
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
   
    // Clear any existing cookies
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax'
    });
    
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax'
    });

    // Save refresh token to database
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Set refreshToken in jwt cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set accessToken in accessToken cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 30 * 60 * 1000 // 30 min
    });

    res.json({ accessToken, userId: foundUser._id });
}

module.exports = { handleAuth };