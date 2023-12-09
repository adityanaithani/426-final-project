import express from "express";
import logger from "morgan";
import helmet from "helmet";
import winston from "winston";
import cors from "cors";
import {
  translateToRNA,
  reverseComplement,
  gcContent,
  nucleotideCounts,
  nucleotideFrequency,
} from "./dna";

const log = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "dna-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "dna.log" }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4001;

app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// translate route

// reverse complement route

// gc content route

// nucleotide counts route

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) DNA Analysis Service: Listening on ${PORT}`);
});
