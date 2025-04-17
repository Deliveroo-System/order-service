const jwt = require("jsonwebtoken");

const generateToken = (userId, email, role) => {
  if (!userId || !email || !role) {
    throw new Error("Missing required parameters: userId, email, or role");
  }

  const normalizedRole = `ROLE_${role.toUpperCase()}`; // Normalize role to uppercase with ROLE_ prefix
  const claims = {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": userId.toString().trim(),
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": email,
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": normalizedRole, // Use normalized role
  };

  const token = jwt.sign(claims, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    expiresIn: "1h",
    noTimestamp: true, // Exclude 'iat' claim
  });

  return token;
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    });
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = { generateToken, decodeToken };
