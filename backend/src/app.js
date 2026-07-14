const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "FleetWise API",
    version: "1.0.0",
  });
});

module.exports = app;