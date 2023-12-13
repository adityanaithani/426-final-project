import express from 'express';
import logger from 'morgan';
import winston from 'winston';

const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'event-bus' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'event-bus.log' }),
  ],
});

const app = express();
const PORT = process.env.PORT || 4005;

app.use(logger('dev'));
app.use(express.json());

// const servicePorts = [
//   { name: "sequences", port: 4000 },
//   { name: "dna", port: 4001 },
//   { name: "results", port: 4002 },
// ];

const servicePorts = [4000, 4001, 4002];

app.post('/events', async (req, res) => {
  const event = req.body;
  log.info(`Received event: ${JSON.stringify(event)}`);
  console.log(
    `(${process.pid}) Event Bus: Received event: ${JSON.stringify(event)}`
  );

  // for (const { name, port } of servicePorts) {
  for (const port of servicePorts) {
    try {
      console.log(
        `(${process.pid}) Event Bus: Forwarding event to ${port} ${event.type}`
      );

      // await fetch(`http://${name}:${port}/events`, {
      await fetch(`http://localhost:${port}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (err) {
      console.log(
        `(${process.pid}) Event Bus: Error forwarding event to ${port} ${event.type}`
      );
      console.log(err);
    }
  }

  res.send({ status: 'OK' });
});

app.listen(PORT, () => {
  log.info(`Listening on port ${PORT}`);
  console.log(`(${process.pid}) Event Bus: Listening on ${PORT}`);
});
