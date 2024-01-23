import mongoose from "mongoose";

const DreamSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  date: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  dream: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const Dreams = mongoose.model("Dreams", DreamSchema);
