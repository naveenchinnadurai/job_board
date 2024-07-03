import cors from "cors";
import express from "express";
import { APP_ORIGIN, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import employeeRoutes from "./routes/employee.route";
import employerRoutes from "./routes/employer.route";
import jobRoutes from "./routes/job.route";
import authRoutes from "./routes/auth.route";

const app = express();

// Middleware
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Healthy" });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/employer", employerRoutes);
app.use("/api/v1/job", jobRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

// Start the server
const SERVER_PORT = PORT || 8080;
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
