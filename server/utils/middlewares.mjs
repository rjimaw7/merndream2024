import mongoose from "mongoose";

export const handleInvalidId = (req, res, next) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Dream Not Found" });
  }

  // Continue to the next middleware if the ID is valid
  next();
};
