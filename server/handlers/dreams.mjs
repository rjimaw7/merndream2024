import { validationResult, matchedData } from "express-validator";
import { Dreams } from "../mongoose/dreams.mjs";
import expressAsyncHandler from "express-async-handler";

export const getAllDreamsHandler = expressAsyncHandler(async (req, res) => {
  const dreams = await Dreams.find().sort({ date: 1 });

  res.status(200).json(dreams);
});

export const getDreamByIdHandler = expressAsyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const dreams = await Dreams.findById(id);

  res.status(200).json(dreams);
});

export const createDreamsHandler = expressAsyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  }

  const passedData = matchedData(req);
  const newDream = new Dreams(passedData);

  const savedDream = await newDream.save();
  res.status(201).send(savedDream);
});

export const deleteDreamHandler = expressAsyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const dreams = await Dreams.findById(id);

  await dreams.deleteOne(id);

  res.status(200).json({ success: true });
});

export const updateDreamHandler = expressAsyncHandler(async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const dreams = await Dreams.findByIdAndUpdate(id, { ...body });

  console.log(dreams);

  res.status(200).json(dreams);
});
