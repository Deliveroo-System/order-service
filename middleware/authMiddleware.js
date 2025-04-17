const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized. Invalid token." });

    req.user = decoded; // Store decoded user info (sub, email, role) in req.user
    next();
  });
};

// Middleware to check if the user has the required roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Extract role from token
    const prefixedRoles = roles.map(role => `ROLE_${role.toUpperCase()}`); // Normalize roles to match ROLE_ format
    if (!userRole || !prefixedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }
    next();
  };
};

// Export authenticate middleware to use in routes
module.exports = { authenticateToken, authorizeRoles };