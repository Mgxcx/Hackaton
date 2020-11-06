var express = require("express");
var router = express.Router();
var journeyModel = require("../models/journey");

var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"];
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"];

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login");
});

/* GET homepage. */
router.get("/homepage", function (req, res, next) {
  res.render("homepage");
});

router.post("/homepagesearch", async function (req, res, next) {
  var datebody = new Date(req.body.date);

  var journeyList = await journeyModel.find();

  var journeyListExist = false;
  for (var i = 0; i < journeyList.length; i++) {
    if (
      req.body.departure.toLowerCase() == journeyList[i].departure.toLowerCase() &&
      req.body.arrival.toLowerCase() == journeyList[i].arrival.toLowerCase() &&
      datebody.getTime() == journeyList[i].date.getTime()
    ) {
      journeyListExist = true;
    }
  }

  if (journeyListExist === true) {
    req.session.user = {
      departure: req.body.departure.charAt(0).toUpperCase() + req.body.departure.slice(1),
      arrival: req.body.arrival.charAt(0).toUpperCase() + req.body.arrival.slice(1),
      date: datebody.getTime(),
    };
    res.redirect("/trains");
  } else {
    res.redirect("/oops");
  }
});

/* GET command page. */
router.get("/command", function (req, res, next) {
  if (Object.values(req.query).length > 0) {
    req.session.user.command.push({
      departure: req.query.departureFromFront,
      arrival: req.query.arrivalFromFront,
      date: req.query.dateFromFront,
      departuretime: req.query.timeFromFront,
      price: req.query.priceFromFront,
    });
  }

  res.render("command", { usercommand: req.session.user.command });
});

/* GET commande page. */
router.get("/last-trip", function (req, res, next) {
  res.render("last-trip", { usercommand: req.session.user.command });
});

// Remplissage de la base de donnée, une fois suffit
router.get("/save", async function (req, res, next) {
  // How many journeys we want
  var count = 300;

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {
    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

    if (departureCity != arrivalCity) {
      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();
    }
  }
  res.render("index");
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get("/result", function (req, res, next) {
  // Permet de savoir combien de trajets il y a par ville en base
  for (i = 0; i < city.length; i++) {
    journeyModel.find(
      { departure: city[i] }, //filtre

      function (err, journey) {
        console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    );
  }

  res.render("index");
});

router.get("/trains", async function (req, res, next) {
  var journeyList = await journeyModel.find();
  for (var i = 0; i < journeyList.length; i++) {
    journeyList[i].departure.toLowerCase();
    journeyList[i].arrival.toLowerCase();
    journeyList[i].date.getTime();
  }
  journeyList = await journeyModel.find({
    departure: req.session.user.departure,
    arrival: req.session.user.arrival,
    date: req.session.user.date,
  });
  req.session.user.journey = journeyList;

  if (req.session.user.command == undefined) {
    req.session.user.command = [];
  }
  res.render("trains", { userjourney: req.session.user.journey, usercommand: req.session.user.command });
});

router.get("/oops", function (req, res, next) {
  res.render("oops");
});

module.exports = router;
