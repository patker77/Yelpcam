//Require Modules

import http from "http";
import dotenv from "dotenv";
import app from   "./app.js";
import mongoose from "mongoose";
dotenv.config();
const PORT = process.env.PORT || 5000;

// Creat mongoose database

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("the database is connected");
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`app is listening on port${PORT} `);
});
