const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } = require('../config/jwt');

const generateJwtToken = (id, secret, expiresIn) => {
    return jwt.sign({ id }, secret, { expiresIn });
};

const generateToken = (id) => {
    return generateJwtToken(id, JWT_SECRET, JWT_EXPIRES_IN);
};

const generateRefreshToken = (id) => {
    return generateJwtToken(id, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN);
};

module.exports = { generateToken, generateRefreshToken };