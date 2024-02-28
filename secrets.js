import "dotenv/config";

const port = process.env.PORT;
const mongoDB_uri = process.env.MONGODB_URI;

export { port, mongoDB_uri };
