const { createClient } = require("redis");
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = require("../constants");

const redisClient = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis!");
  } catch (error) {
    console.error("Error while connecting to Redis!\n", error);
    process.exit(1); // Exit the process if Redis fails to connect
  }
};

module.exports = { redisClient, connectRedis };
