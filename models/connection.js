const mongoose = require("mongoose");

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// --------------------- BDD -----------------------------------------------------
mongoose.connect(
  "mongodb+srv://Mgxcx:hello@cluster0.00af7.mongodb.net/Ticketac?retryWrites=true&w=majority",
  options,
  function (err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info("*** Database Ticketac connection : Success ***");
    }
  }
);
