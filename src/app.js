const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require("./db/conn");

const Register = require("./models/registers");

const app = express();
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../Templates/views")
const partial_path = path.join(__dirname, "../Templates/partials")

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.use(express.json());
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index.hbs")
});

// Showing secret page
app.get("/home", (req, res) => {
  res.render("home");
});
// handling add contact page
app.get("/add_contact", (req, res) => {
  res.render("add_contact");
});
// handling profile page
app.get("/profile", (req, res) => {
  res.render("profile");
});
// Handling user login
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
})

//Handling user login
var User_Email;
app.post("/login", async (req, res) => {
  try {
    const plainPassword = req.body.password;
    User_Email = req.body.email;
    const user = await Register.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(plainPassword, user.password)) {
        res.render("home");
      } else {
        res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "Email doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
});
app.post("/signup", async (req, res) => {
  try {
    const saltRounds = 10;
    const plainPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    const Confirm_Password = req.body.ConfirmPassword;
    if (req.body.password === Confirm_Password) {
      const imageDataField = req.body.imageDataField;
      const RegisUser = new Register({
        username: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        data: imageDataField,
      });
      const savedUser = await RegisUser.save();
      res.status(201).render("index");
    }
    else {
      res.send("password is not matching");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
app.post("/add_contact", async (req, res) => {
  try {
    // Get the current user's friends array.
    const user = await Register.findOne({
      email: User_Email,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Update the user's friends array.
    user.friend.push({
      friend_name: req.body.name,
      friend_email: req.body.email,
      friend_phone: req.body.phone,
    });
    await user.save();
    res.status(201).render("home");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// FETCH THE DATA
app.get("fetchAll", (req, res)=>{
  Register.find((err, val)=>{
    if(err){
      console.log(err);
    }
    else{
      res.json(val);
    }
  })
})


app.listen(port, () => {
  console.log(`The server is running at port number ${port}`);
});