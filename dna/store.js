import fs from 'fs';

// import { MongoClient } from 'mongodb';

// const url = 'mongodb://admin:secret@genome-db:27017';
// // const client = new MongoClient(url);
// const dbName = 'genome-db';
// let client;

const read = () => {
  if (fs.existsSync('stagedSeqs.json')) {
    const posts = fs.readFileSync('stagedSeqs.json');
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (stagedSeqs) => {
  fs.writeFileSync('stagedSeqs.json', JSON.stringify(stagedSeqs));
};

const drop = () => {
  if (fs.existsSync('stagedSeqs.json')) {
    fs.writeFileSync('stagedSeqs.json', JSON.stringify({}));
  }
};

export default {
  read,
  write,
  drop,
};

// let analysis;
// const connect = async () => {
//   if (!analysis) {
//     await client.connect();
//     const db = client.db(dbName);
//     analysis = db.collection('analysis');
//   }
//   return analysis;
// };

// const connect = async () => {
//   if (!client || !client.isConnected()) {
//     client = await MongoClient.connect(url, { useUnifiedTopology: true });
//   }
//   return client.db(dbName);
// };

// const read = async () => {
//   const db = await connect();
//   const collection = db.collection('stagedSeqs');
//   const stagedSeqs = await collection.find().toArray();
//   return stagedSeqs;
// };

// const write = async (stagedSeqs) => {
//   const db = await connect();
//   const collection = db.collection('stagedSeqs');
//   await collection.insertMany(stagedSeqs);
// };

// const drop = async () => {
//   const db = await connect();
//   const collection = db.collection('stagedSeqs');
//   await collection.deleteMany({});
// };

// module.exports = {
//   read,
//   write,
//   drop,
// };

// // reads the first document in the collection (if storing as one, this is the only document)
// const read = async () => {
//   try {
//     const collection = await connect();
//     const docs = await collection.find({}).toArray();
//     return docs[0] || {};
//   } catch (err) {
//     console.log(err);
//   }
// };

// // write
// const write = async (data) => {
//   try {
//     const collection = await connect();
//     await collection.deleteMany({});
//     await collection.insertOne(data);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const drop = async () => {
//   try {
//     const collection = await connect();
//     await collection.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// };

// export default { read, write, drop };
