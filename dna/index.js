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

// add new set of analyzed sequences to collection
app.post('/analyze', async (req, res) => {
  console.log(`(${process.pid}) DNA Service: POST /analyze`);
  const { sequences } = req.body;

  // loop through sequences and analyze each one
  let analyzed = [];
  for (const sequenceObj of Object.values(sequences)) {
    const { id, sequence } = sequenceObj;

    let rna = '',
      reverse = '',
      gc = 0,
      counts = {},
      frequency = {};

    if (sequence !== undefined) {
      rna = DNA.translateToRNA(sequence);
      reverse = DNA.reverseComplement(sequence);
      gc = DNA.gcContent(sequence);
      counts = DNA.nucleotideCounts(sequence);
      frequency = DNA.nucleotideFrequency(sequence);
    }

    const pkg = {
      id,
      sequence,
      rna,
      reverse,
      gc,
      counts,
      frequency,
    };
    analyzed.push(pkg);
  }

  log.info(`Analyzed ${JSON.stringify(analyzed)}`);
  // add sequences to collection
  await Store.write(analyzed);

  // event bus
  try {
    // await fetch('http://event-bus:4005/events', {
    await fetch('http://localhost:4005/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'SequencesAnalyzed',
        data: {
          analyzed,
        },
      }),
    });
  } catch (err) {
    console.log(`(${process.pid}) DNA Service: ${err}`);
    log.error(`DNA Service: ${err}`);
    return res.status(500).json({
      status: 'ERROR',
      message: err,
    });
  }
  res.status(201).json({ analyzed });
  log.info(`Analyzed ${JSON.stringify(analyzed)}`);
  console.log(`(${process.pid}) DNA Service: ${JSON.stringify(analyzed)}`);
});

// get all analyzed sequences
app.get('/analyze', async (req, res) => {
  console.log(`(${process.pid}) DNA Service: GET /analyze`);
  const analyzed = await Store.read();
  console.log(`(${process.pid}) DNA Service: ${JSON.stringify(analyzed)}`);
  res.status(200).send(analyzed);
});

// delete all analyzed sequences
app.delete('/analyze', async (req, res) => {
  console.log(`(${process.pid}) DNA Service: DELETE /analyze`);
  await Store.drop();
  res.status(200).json('Deleted all analyzed sequences');
});

app.post('/events', async (req, res) => {
  const event = req.body;
  const type = event.type;

  console.log(`(${process.pid}) DNA Analysis Service Received Event: ${type}`);
  log.info(`DNA Analysis Service Received Event: ${type}`);

  res.send({});
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) DNA Analysis Service: Listening on ${PORT}`);
});

export default log;
