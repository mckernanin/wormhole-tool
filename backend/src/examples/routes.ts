import * as express from "express";
import * as errors from "../utils/error";
import * as controller from "./controller";
import { readToken } from "../authentication/controller";

const router = express.Router();

router.get(
  "/solarsystem",
  errors.catchErrors(controller.getCurrentSolarSystem)
);
router.get("/hey-there", readToken, errors.catchErrors(controller.heyThere));

export default router;
