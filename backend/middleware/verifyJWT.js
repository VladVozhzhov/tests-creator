const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    let token;

    if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
            
            req.user = {
                _id: decoded.UserInfo._id,
                username: decoded.UserInfo.username
            };
            next();
        }
    );
}

module.exports = verifyJWT;