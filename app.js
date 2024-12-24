import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));
app.use(express.static(path.join(path.resolve(), "public")));

app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/", routes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `http  is running on port: http://localhost:${PORT} | Environment ${process.env.NODE_ENV}`
  );
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the http for handling uncaught exception`);
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the http for ${err.message}`);
  console.log(`shutting down the http for unhandle promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
