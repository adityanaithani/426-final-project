import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import cors from 'cors';
import Store from './store.js';
import DNA from './dna.js';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'dna-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'dna.log' }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4001;

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// translate route
app.post('/translate', DNA.validateDNA, async (req, res) => {
  console.log(`(${process.pid}) DNA Service: POST /translate`);
  const { dna } = req.body;
  const rna = DNA.translateToRNA(dna);
  log.info(`Translated ${dna} to ${rna}`);
  res.status(200).json({ rna });
});

// reverse complement route
app.post('/reverse-complement', DNA.validateDNA, async (req, res) => {
  const { dna } = req.body;
  const reverse = DNA.reverseComplement(dna);
  log.info(`Reverse complement of ${dna} is ${reverse}`);
  res.status(200).json({ reverse });
});

// gc content route
app.post('/gc-content', DNA.validateDNA, async (req, res) => {
  const { dna } = req.body;
  const gc = DNA.gcContent(dna);
  log.info(`GC content of ${dna} is ${gc}`);
  res.status(200).json({ gc });
});

// nucleotide counts route
app.post('/nucleotide-counts', DNA.validateDNA, async (req, res) => {
  const { dna } = req.body;
  const counts = DNA.nucleotideCounts(dna);
  log.info(`Nucleotide counts of ${dna} are ${JSON.stringify(counts)}`);
  res.status(200).json({ counts });
});

// nucleotide frequency route
app.post('/nucleotide-frequency', DNA.validateDNA, async (req, res) => {
  const { dna } = req.body;
  const frequency = DNA.nucleotideFrequency(dna);
  log.info(`Nucleotide frequency of ${dna} is ${JSON.stringify(frequency)}`);
  res.status(200).json({ frequency });
});

// add new set of sequences to collection
app.post('/analyze', async (req, res) => {
  console.log(`(${process.pid}) DNA Service: POST /analyze`);
  const { sequences } = req.body;
  console.log(sequences);
  res.status(200).json({ sequences });
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) DNA Analysis Service: Listening on ${PORT}`);
});

export default log;
