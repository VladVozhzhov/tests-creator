const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.header['authorization'];
    if (!authHeader) return res.sendStatus(401); // Unauthorized
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden
            req.user = decoded.username;
            next()
        }
    );
}

module.exports = verifyJWT;