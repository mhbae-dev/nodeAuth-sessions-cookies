import express from "express";
import session from "express-session";
import mongoose from "mongoose";

const app = express();
const PORT = 5000;

//DATABASE CONNECTION
mongoose
  .connect("mongodb://127.0.0.1:27017/sessions")
  .then((res) => {
    console.log("MongoDDB Connected");
  })
  .catch((error) => handleError(error));

app.use(
  session({
    secret: "key will sign cookie",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  res.send("Hello Sessions");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
