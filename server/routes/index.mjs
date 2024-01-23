import { Router } from "express";
import dreamsRouter from "./dreams.mjs";

const router = Router();

router.use(dreamsRouter);

export default router;
