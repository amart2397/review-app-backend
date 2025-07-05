import express from "express";
import rootRouter from "./routes/root.js";
import userRouter from "./routes/userRoutes.js";
import mediaRouter from "./routes/mediaRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import path from "path";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import sessionConfig from "./config/sessionConfig.js";
import AppError from "./utils/AppError.js";
import session from "express-session";
import env from "dotenv";

const app = express();
env.config();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

//Middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
//app.use(cookieParser());  -DO I NEED THIS? IF NOT DELETE AND REMOVE DEPENDENCY
app.use(session(sessionConfig));
app.use("/", express.static(path.join(__dirname, "public")));

//Routing
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/media", mediaRouter);
app.use("/reviews", reviewRouter);

//All unhandled routes (404 page handled in errorHandler)
app.all(/.*/, (req, res, next) => {
  next(AppError.notFound("404 Not Found"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
