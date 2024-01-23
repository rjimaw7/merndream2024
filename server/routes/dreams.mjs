import { Router } from "express";
import {
  createDreamsHandler,
  getAllDreamsHandler,
  getDreamByIdHandler,
  deleteDreamHandler,
  updateDreamHandler,
} from "../handlers/dreams.mjs";
import { checkSchema } from "express-validator";
import { createDreamsValidationSchema } from "../utils/validationSchemas.mjs";
import { handleInvalidId } from "../utils/middlewares.mjs";

const router = Router();

router.get("/api/dreams", getAllDreamsHandler);
router.get("/api/dreams/:id", handleInvalidId, getDreamByIdHandler);

router.post(
  "/api/dreams",
  checkSchema(createDreamsValidationSchema),
  createDreamsHandler
);

router.delete("/api/dreams/:id", handleInvalidId, deleteDreamHandler);
router.patch("/api/dreams/:id", handleInvalidId, updateDreamHandler);

export default router;
