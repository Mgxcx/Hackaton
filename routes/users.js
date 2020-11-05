var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

/* GET users listing. */
router.post("/sign-up", async function (req, res, next) {
  var searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });

  if (!searchUser) {
    var newUser = new userModel({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
    });
    var newUser = await newUser.save();

    req.session.user = {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
    };
    res.redirect("/homepage");
  } else {
    res.render("login");
  }
});

router.post("/sign-in", async function (req, res, next) {
  var searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });

  if (searchUser) {
    req.session.user = {
      lastname: searchUser.lastname,
      firstname: searchUser.firstname,
      email: searchUser.email,
      password: searchUser.password,
    };
    res.redirect("/homepage");
  } else {
    res.render("login");
  }
});

module.exports = router;
