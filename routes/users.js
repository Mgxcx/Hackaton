var express = require("express");
var router = express.Router();
var userModel = require("../models/users");

/* GET users listing. */
router.post("/signup", async function (req, res, next) {
  var searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });

  if (!searchUser) {
    var newUser = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    });
    var newUser = await newUser.save();

    req.session.user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    };
    res.redirect("/homepage");
  } else {
    res.render("login");
  }
});

router.post("/signin", async function (req, res, next) {
  var searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });

  if (searchUser) {
    req.session.user = {
      firstname: searchUser.firstname,
      lastname: searchUser.lastname,
      email: searchUser.email,
      password: searchUser.password,
    };
    res.redirect("/homepage");
  } else {
    res.render("login");
  }
});

module.exports = router;
