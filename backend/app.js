require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

const connectDB = require("./config/database");
const errorHandlerMiddleware = require("./middleware/errorHandler");
require("./models/User");

const app = express();
const httpServer = createServer(app);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
require("./config/passport")(passport);

app.use(passport.initialize());

const PORT = process.env.PORT || 3000;
app.set("port", PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(require("./routes"));
require("./socketLogic").sockets(httpServer);

app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    httpServer.listen(app.get("port"), () =>
      console.log(`Server has started on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
