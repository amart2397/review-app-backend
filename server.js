import express from "express";
import rootRouter from "./routes/root.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import AppError from "./utils/AppError.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", rootRouter);
app.use("/users", userRouter);

//All unhandled routes default to 404 page below (404 page handled in errorHandler)
app.all(/.*/, (req, res, next) => {
  next(AppError.notFound("404 Not Found"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
