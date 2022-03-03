import express from "express";
import bcrypt from "bcryptjs";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import mongoose from "mongoose";
import UserModel from "./models/User.js";
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

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/login", (req, res) => {
  const error = req.session.error;
  res.render("login", { err: error });
});

app.get("/register", (req, res) => {
  const error = req.session.error;
  res.render("register", { err: error });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await UserModel.findOne({ email });

  if (user) {
    req.session.error = "User already exists";
    return res.redirect("/register");
  }

  const hashedPsw = await bcrypt.hash(password, 12);

  user = new UserModel({
    username,
    email,
    password: hashedPsw,
  });

  await user.save();
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    req.session.error = "This user does not exist";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.session.error = "Incorrect password";
    return res.redirect("/login");
  }

  res.redirect("/dashboard");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
