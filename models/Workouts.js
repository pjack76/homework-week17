const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutsSchema = new Schema({
  Workout: [
    {
      type: Schema.Types.ObjectId,
      day: new Date,
      ref: "Exercise"
    }
  ]
});

const Workout = mongoose.model("Workout", WorkoutsSchema);

module.exports = Workout;
