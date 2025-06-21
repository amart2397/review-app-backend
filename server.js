import express from "express";
import router from "./routes/root.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));