import "dotenv/config";
import * as express from "express";
import {
  login,
  callback,
  getCurrentSolarSystem,
  heyThere
} from "./authentication";

const app = express();
app.set("port", 1337);

app.get("/", (req, res) => res.send("<h1>Hello world!</h1>"));
app.get("/auth", login);
app.get("/oauth", callback);
app.get("/solarsystem", getCurrentSolarSystem);
app.get("/hey-there", heyThere);

app.listen(app.get("port"), () => console.log("API Operational."));
