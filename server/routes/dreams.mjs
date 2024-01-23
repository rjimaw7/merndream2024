import { Router } from "express";
import {
  createDreamsHandler,
  getAllDreamsHandler,
  getDreamByIdHandler,
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

export default router;
