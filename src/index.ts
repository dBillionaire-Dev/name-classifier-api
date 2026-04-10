import express, {type Application, type Request, type Response, type NextFunction} from "express";
import { classifyRouter } from "./routes/classify";
import "dotenv/config";

const app: Application = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());

// Global CORS header — required for grading script
app.use((_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight OPTIONS requests
app.use((_req: Request, res: Response, next: NextFunction) => {
    if (_req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

// Routes
app.use("/api", classifyRouter);

// 404 fallback
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
      status: "error",
      message: "Route not found"
  });
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
