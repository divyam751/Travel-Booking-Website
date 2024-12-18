const jwt = require("jsonwebtoken");
const { ApiResponse } = require("../utils/ApiResponse");
const { SECRET_KEY } = require("../constants");

const AuthMiddleware = {
  authenticate: (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(
        res,
        ["Authentication token missing"],
        401,
        "Unauthorized"
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        // If token verification fails, send an error response
        return ApiResponse.error(
          res,
          [err.message || "Invalid or expired token"],
          401,
          "Unauthorized"
        );
      }

      // Store the decoded user data in the request object
      req.user = decoded;
      next(); // Proceed to the next middleware or route handler
    });
  },

  authorize: (allowedRoles) => {
    return (req, res, next) => {
      // If no user is authenticated, return a 401 error
      if (!req.user) {
        return ApiResponse.error(
          res,
          ["User not authenticated"],
          401,
          "Unauthorized"
        );
      }

      // If user role doesn't match allowed roles, return a 403 error
      if (!allowedRoles.includes(req.user.role)) {
        return ApiResponse.error(res, ["Access denied"], 403, "Forbidden");
      }

      next(); // Proceed to the next middleware or route handler
    };
  },
};

module.exports = { AuthMiddleware };
