const mongoose = require("mongoose");
const { URI, DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${URI}/${DB_NAME}`);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
