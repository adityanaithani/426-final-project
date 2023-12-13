import express from "express";
import logger from "morgan";
import helmet from "helmet";
import winston from "winston";
import cors from "cors";

const log = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "results-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "results.log" }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4002;

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) Results Service: Listening on ${PORT}`);
});
