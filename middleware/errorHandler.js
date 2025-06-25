import { logEvents } from "./logger.js";
import AppError from "../utils/AppError.js";
import env from "dotenv";
import path from "path";
env.config();
const __dirname = import.meta.dirname;

//Pulled this logic out of server.js and into this middleware, since it is specifc to a 404 Error
const handle404 = (err, req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.json({ message: err.message });
  } else {
    return res.type("txt").send(err.message);
  }
};

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );

  if (process.env.NODE_ENV !== "production") {
    console.log(err.stack);
  }

  if (err instanceof AppError) {
    if (err.statusCode === 404) {
      return handle404(err, req, res);
    }
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: "something went wrong" });
};

export default errorHandler;
