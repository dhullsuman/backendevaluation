const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const userRoutes = express.Router();

userRoutes.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
    try {
        const emails = await UserModel.find({ email });
        if (emails.length > 0) {
            res.send("Already registered");
        } else {
            bcrypt.hash(password, 5, async (err, securepass) => {
                if (err) {
                    res.send("Something went wrong.");
                } else {
                    const user = new UserModel({ name, email, gender, password: securepass });
                    await user.save();
                    res.send("Registered successfully.");
                }
            });
        }
  } catch (err) {
    res.send("Error in registering the user");
    console.log(err);
  }
});

userRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.find({ email });

        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user[0]._id }, process.env.key);
                    res.send({ msg: "Login Successfull", token: token });
                } else {
                    res.send("Wrong Credntials");
                }
            })
        } else {
            res.send("Wrong Credntials");
        }
    } catch (err) {
        res.send("Error in logging in the user");
        console.log(err);
    }
});

module.exports = { userRoutes };
