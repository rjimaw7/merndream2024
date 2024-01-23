import { validationResult, matchedData } from "express-validator";
import { Dreams } from "../mongoose/dreams.mjs";

export const getAllDreamsHandler = async (req, res) => {
  try {
    const dreams = await Dreams.find();
    return res.send(dreams);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const getDreamByIdHandler = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const dreams = await Dreams.findById(id);

    if (!dreams) return res.sendStatus(404);

    return res.send(dreams);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const createDreamsHandler = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  }

  const passedData = matchedData(req);
  const newDream = new Dreams(passedData);

  try {
    const savedDream = await newDream.save();
    return res.status(201).send(savedDream);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
