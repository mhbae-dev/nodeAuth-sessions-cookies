import bcrypt from "bcryptjs";
import UserModel from "../models/User.js";

//Landing
const landingPage = (req, res) => {
  res.render("landing");
};

//dashboard
const dashboardGet = (req, res) => {
  const username = req.session.username;
  res.render("dashboard", { name: username });
};

//login
const loginGet = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

const loginPost = async (req, res) => {
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
  req.session.isAuth = true;
  res.redirect("/dashboard");
};

//Logout
const logoutPost = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
};

//register
const registerGet = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

const registerPost = async (req, res) => {
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
};

export {landingPage, loginGet, loginPost, logoutPost, registerGet, registerPost, dashboardGet}