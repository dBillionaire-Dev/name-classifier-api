import { Router, type Request, type Response } from "express";
import { fetchGenderize } from "../services/genderize";
import { processGenderizeResponse } from "../utils/processor";

export const classifyRouter = Router();

classifyRouter.get("/classify", async (req: Request, res: Response) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Missing required query parameter: name",
    });
  }

  if (typeof name !== "string") {
    return res.status(422).json({
      status: "error",
      message: "Query parameter 'name' must be a string",
    });
  }

  const genderizeResult = await fetchGenderize(name);

  if (!genderizeResult.success) {
    return res.status(genderizeResult.statusCode).json({
      status: "error",
      message: genderizeResult.message,
    });
  }

  const raw = genderizeResult.data!;

  if (raw.gender === null || raw.count === 0) {
    return res.status(422).json({
      status: "error",
      message: "No prediction available for the provided name",
    });
  }

  const processed = processGenderizeResponse(name, raw);

  return res.status(200).json({
    status: "success",
    data: processed,
  });
});
