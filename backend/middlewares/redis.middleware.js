const { redisClient } = require("../config/redis");

const redisMiddleware = (req, res, next) => {
  req.redisClient = redisClient;
  next();
};

module.exports = { redisMiddleware };
