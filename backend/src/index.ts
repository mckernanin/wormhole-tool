import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import config from "./config";
import authentication from "./authentication/routes";
import examples from "./examples/routes";
import * as errors from "./utils/error";

mongoose.connect(
  config.mongodb,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.set("port", config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("<h1>Hello world!</h1>"));
app.use("/v1/authentication", authentication);
app.use("/examples", examples);
app.use(errors.notFound);

if (config.env === "development") {
  app.use(errors.developmentErrors);
  app.use(morgan("dev"));
}
app.use(errors.productionErrors);

app.listen(app.get("port"), () => console.log("Warp drive active..."));
