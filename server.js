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

mongoose.connect(process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds127982.mlab.com:27982/heroku_742rdd7c", { useNewUrlParser: true });

db.Exercise.create({ name: "Fitness Regiments" })
  .then(dbFitness => {
    console.log(dbFitness);
  })
  .catch(({ message }) => {
    console.log(message);
  });

/*/load default html page
app.get("/", (req, res) => {
  console.log("why am i here?;")
 // res.send("public/exercise.html");
});
*/
app.get("/exercise", (req, res) => {
  db.Exercise.find({})
    .then(dbExercise => {
      res.json(dbExercise);
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
  db.Workout.find({})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", ({ body }, res) => {
  db.Exercise.create(body)
    .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.get("/stats", (req, res) => {
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
