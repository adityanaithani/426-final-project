import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import winston from 'winston';
import cors from 'cors';
import DNA from '../dna/dna.js';
import Store from './store.js';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'results-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'results.log' }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4002;

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// compute results
app.post('/compute', async (req, res) => {
  console.log(`(${process.pid}) Results Service: POST /compute`);
  const { sequences } = req.body;

  // get all analyzed sequences from dna service
  const analyzed = await fetch('http://localhost:4001/analyze', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const analyzedJson = await analyzed.json();
  // convert analyzedJson to array
  const analyzedArray = Object.values(analyzedJson);
  console.log(analyzedArray);
  console.log(
    `(${process.pid}) Results Service: ${JSON.stringify(analyzedJson)}`
  );

  // delete all sequences from dna service
  // const deleted = await fetch('http://localhost:4001/analyze', {
  //   method: 'DELETE',
  //   headers: { 'Content-Type': 'application/json' },
  // });
  // const deletedJson = await deleted.json();

  // loop through analyzedJson and map the sequence field to one string

  const genome = analyzedArray.map((obj) => obj.sequence).join('');

  // run genome through DNA class methods
  const rna = DNA.translateToRNA(genome);
  const reverse = DNA.reverseComplement(genome);
  const gc = DNA.gcContent(genome);
  const counts = DNA.nucleotideCounts(genome);
  const frequency = DNA.nucleotideFrequency(genome);

  // build results object
  const results = {
    genome,
    rna,
    reverse,
    gc,
    counts,
    frequency,
  };

  // write results to collection
  await Store.write(results);

  // event bus
  try {
    await fetch('http://localhost:4005/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ResultsComputed',
        data: {
          results,
        },
      }),
    });
  } catch (err) {
    console.log(`(${process.pid}) Results Service: ${err}`);
    return res.status(500).send({
      status: 'ERROR',
      message: err,
    });
  }

  console.log(`(${process.pid}) Results Service: ${JSON.stringify(results)}`);
  res.status(200).send(results);
});

// get all results
app.get('/results', async (req, res) => {
  console.log(`(${process.pid}) Results Service: GET /results`);
  const results = await Store.read();
  console.log(`(${process.pid}) Results Service: ${JSON.stringify(results)}`);
  res.status(200).send(results);
});

// delete all results
app.delete('/results', async (req, res) => {
  console.log(`(${process.pid}) Results Service: DELETE /results`);
  await Store.drop();
  res.status(200).json('Deleted all results');
});

app.post('/events', async (req, res) => {
  const event = req.body;
  const type = event.type;

  console.log(`(${process.pid}) Results Service Received Event: ${type}`);
  log.info(`Results Service Received Event: ${type}`);

  res.send({});
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) Results Service: Listening on ${PORT}`);
});
