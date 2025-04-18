const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(roleName, userId, email) {
    if (!email || !roleName) {
        throw new Error("Email or RoleName is null or empty");
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("Jwt:SecretKey is missing in configuration.");
    }

    const claims = {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": userId.toString().trim(),
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": email,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": roleName
    };

    const options = {
        algorithm: 'HS256',
        header: {
            alg: 'HS256',
            typ: 'JWT'
        },
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        expiresIn: '1h'
    };

    const token = jwt.sign(claims, secretKey, options);
    return token;
}

module.exports = { generateToken };