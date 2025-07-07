import express from "express";
import rootRouter from "./routes/root.js";
import userRouter from "./routes/userRoutes.js";
import mediaRouter from "./routes/mediaRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import authRouter from "./routes/authRoutes.js";
import UsersService from "./service/usersService.js";
import path from "path";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser"; //REMOVE LATER
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import sessionConfig from "./config/sessionConfig.js";
import AppError from "./utils/AppError.js";
import session from "express-session";
import passport from "passport";
import configurePassport from "./config/passport.js";
import env from "dotenv";

const app = express();
env.config();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;
configurePassport(passport, UsersService);

//Middleware
app.use(cors(corsOptions));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

//Routing
app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/media", mediaRouter);
app.use("/reviews", reviewRouter);

//All unhandled routes (404 page handled in errorHandler)
app.all(/.*/, (req, res, next) => {
  next(AppError.notFound("404 Not Found"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
