import express from "express";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import mongoose from "mongoose";

const mongoURI = "mongodb://127.0.0.1:27017/sessions";
const MongoDBStore = connectMongoDBSession(session);

const app = express();
const PORT = 5000;

//DATABASE CONNECTION
mongoose
  .connect(mongoURI)
  .then((res) => {
    console.log("MongoDDB Connected");
  })
  .catch((error) => handleError(error));

const store = new MongoDBStore({
  uri: mongoURI,
  collection: "session",
});

app.use(
  session({
    secret: "key will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", (req, res) => {
  req.session.isAuth = true;
  res.send("Hello Sessions");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
