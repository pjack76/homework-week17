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

app.post("/api/workouts", (req, res) => {
  db.Exercise.create({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/exercise?", (req, res) => {
  db.Workout.find({}).populate("exercises")
    .then(dbWorkout => {
      res.send(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/exercise", (req, res) => {
  db.Workout.find({}).populate("exercises")
    .then(dbExercise => {
      res.send(dbExercise);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("api/workouts", (req, res) => {
  db.Exercise.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", ({ body }, res) => {
  db.Exercise.create(body)
    .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
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
