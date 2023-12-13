import express from "express";
import logger from "morgan";
import helmet from "helmet";
import winston from "winston";
import cors from "cors";
import { randomBytes } from "crypto";
import Store from "./store.js";

const log = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "sequences-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "sequences.log" }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// get all sequences
app.get("/sequences", async (req, res) => {
  console.log(`(${process.pid}) Sequences Service: GET /sequences`);
  const sequences = await Store.read();
  console.log(
    `(${process.pid}) Sequences Service: ${JSON.stringify(sequences)}`
  );
  res.status(200).send(sequences);
});

// add new sequence to collection
app.post("/sequences", async (req, res) => {
  console.log(`(${process.pid}) Sequences Service: POST /sequences`);
  const id = randomBytes(4).toString("hex");
  const { sequence } = req.body;

  const sequences = Store.read();
  console.log(
    `(${process.pid}) Sequences Service: ${JSON.stringify(sequences)}`
  );

  // modify object structure here
  sequences[id] = { id, sequence };
  await Store.write(sequences);

  try {
    await fetch("http://event-bus:4005/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SequenceAdded",
        data: {
          id,
          sequence,
        },
      }),
    });
  } catch (err) {
    console.log(`(${process.pid}) Sequences Service: ${err}`);
    res.status(500).send({
      status: "ERROR",
      message: err,
    });
  }
  res.status(201).send(sequences[id]);
  console.log(
    `(${process.pid}) Sequences Service: ${JSON.stringify(sequences)}`
  );
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) Sequences Service: Listening on ${PORT}`);
});
