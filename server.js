const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 8080;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true });

db.Workout.create({ name: "Fitness Regiments" })
  .then(dbFitness => {
    console.log(dbFitness);
  })
  .catch(({ message }) => {
    console.log(message);
  });

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "exercise.html"));
});

app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", ({body}, res) => {
  console.log("test");
  db.Workout.create({})
    .then(dbWorkout => {
      res.json(dbWorkout);
     // res.jasn(body);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", ({ body, params }, res) => {
console.log('params', params.id)
    db.Workout.findByIdAndUpdate(params.id, { $push: { exercises: body } }, { new: true, runValidators: true  })
    .then(dbWorkout => {
      //console.log("from DB", dbWorkout)
      res.json(dbWorkout);
    })
    .catch(err => {
    console.log("err =>", err)
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .populate("Workout")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
