import express from "express";
import logger from "morgan";
import helmet from "helmet";
import winston from "winston";
import cors from "cors";
import {
  validateDNA,
  translateToRNA,
  reverseComplement,
  gcContent,
  nucleotideCounts,
  nucleotideFrequency,
} from "./dna.js";

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
app.post("/translate", validateDNA, async (req, res) => {
  console.log(`(${process.pid}) DNA Service: POST /translate`);
  const { dna } = req.body;
  const rna = translateToRNA(dna);
  // add to db
  log.info(`Translated ${dna} to ${rna}`);
  res.status(200).json({ rna });
});

// reverse complement route
app.post("/reverse-complement", validateDNA, async (req, res) => {
  const { dna } = req.body;
  const reverse = reverseComplement(dna);
  // add to db
  log.info(`Reverse complement of ${dna} is ${reverse}`);
  res.status(200).json({ reverse });
});

// gc content route
app.post("/gc-content", validateDNA, async (req, res) => {
  const { dna } = req.body;
  const gc = gcContent(dna);
  // add to db
  log.info(`GC content of ${dna} is ${gc}`);
  res.status(200).json({ gc });
});

// nucleotide counts route
app.post("/nucleotide-counts", validateDNA, async (req, res) => {
  const { dna } = req.body;
  const counts = nucleotideCounts(dna);
  // add to db
  log.info(`Nucleotide counts of ${dna} are ${JSON.stringify(counts)}`);
  res.status(200).json({ counts });
});

// nucleotide frequency route
app.post("/nucleotide-frequency", validateDNA, async (req, res) => {
  const { dna } = req.body;
  const frequency = nucleotideFrequency(dna);
  // add to db
  log.info(`Nucleotide frequency of ${dna} is ${JSON.stringify(frequency)}`);
  res.status(200).json({ frequency });
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) DNA Analysis Service: Listening on ${PORT}`);
});

export default log;
