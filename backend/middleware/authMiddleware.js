const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes – verify JWT token
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. Check if the user has a role assigned at all
    if (!req.user.role) {
      return res
        .status(403)
        .json({
          message: "Your account has no assigned role. Access prohibited.",
        });
    }

    // 2. Check if the assigned role is authorized
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `Access Denied: The '${req.user.role}' role cannot perform this action.`,
        });
    }
    next();
  };
};

module.exports = { protect, authorize };
