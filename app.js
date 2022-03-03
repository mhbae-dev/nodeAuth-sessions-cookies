import express from "express";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import mongoose from "mongoose";
import {
  landingPage,
  loginGet,
  loginPost,
  logoutPost,
  registerGet,
  registerPost,
  dashboardGet,
} from "./controllers/appController.js";
import isAuth from "./middleware/isAuth.js";
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

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", landingPage);

app.get("/login", loginGet);

app.get("/register", registerGet);

app.post("/register", registerPost);

app.post("/login", loginPost);

app.get("/dashboard", isAuth, dashboardGet);

app.post("/logout", logoutPost);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
