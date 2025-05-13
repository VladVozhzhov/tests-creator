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
        { expiresIn: '7d' }
    );

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax'
    });

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken, userId: foundUser._id });
}

const handleCookieCheck = (req, res) => {
  const token = req.cookies['accessToken'];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.sendStatus(403);
  }
}

module.exports = { handleAuth, handleCookieCheck };