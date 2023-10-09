const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const authRoutes = require("./routes/auth-r");
const taskRoutes = require('./routes/task-r')

const MONGODB_URI = "mongodb://localhost:27017/task-mongo";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my_secret_password_to_sign_the_cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(authRoutes);
app.use(taskRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(4800, () => {
      console.log("Server on port 4800");
    });
  })
  .catch((err) => {
    err = new Error("Fail trying to connect to DB");
    err.status = 404;
    throw err;
  });
