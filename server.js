const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/training", { useNewUrlParser: true });

db.Workout.create({ name: "Fitness Regiments" })
  .then(dbFitness => {
    console.log(dbFitness);
  })
  .catch(({ message }) => {
    console.log(message);
  });

//load default html page
app.get("/", (req, res) => {
  res.send("public/index.html");
});

app.get("/notes", (req, res) => {
  db.Note.find({})
    .then(dbNote => {
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/workout:id", (req, res) => {
  db.User.find({})
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/add", ({ body }, res) => {
  db.Note.create(body)
    .then(({ _id }) => db.User.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true }))
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/stats", (req, res) => {
  db.User.find({})
    .populate("notes")
    .then(dbUser => {
      res.json(dbUser);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
