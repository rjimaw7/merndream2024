import { matchedData, validationResult } from "express-validator";
import { Dreams } from "../mongoose/dreams.mjs";
import expressAsyncHandler from "express-async-handler";

// export const getAllDreamsHandler = expressAsyncHandler(async (req, res) => {
//   const dreams = await Dreams.find().sort({ date: 1 });

//   res.status(200).json(dreams);
// });

// export const getAllDreamsHandler = expressAsyncHandler(async (req, res) => {
//   const { title } = req.query;

//   // Create a regular expression to match the partial title (case-insensitive)
//   const titleRegex = new RegExp(title, "i");

//   // Use the regular expression in the query to find matching documents
//   const dreams = await Dreams.find({ title: titleRegex })
//     .sort({ date: 1 })
//     .limit(10);

//   res.status(200).json(dreams);
// });

export const getAllDreamsHandler = expressAsyncHandler(async (req, res) => {
  const { title, page = 1, pageSize = 10 } = req.query;

  // Calculate the skip value based on the current page and page size
  const skip = (page - 1) * pageSize;

  // Create a regular expression to match the partial title (case-insensitive)
  const titleRegex = new RegExp(title, "i");

  // Use the regular expression in the query to find matching documents
  const dreams = await Dreams.find({ title: titleRegex })
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(pageSize));

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

  await dreams.deleteOne({ _id: id });

  res.status(200).json({ success: true });
});

export const updateDreamHandler = expressAsyncHandler(async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const dreams = await Dreams.findByIdAndUpdate(id, { ...body });

  res.status(200).json(dreams);
});
