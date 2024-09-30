// import { MongoClient } from 'mongodb';

// const url = 'mongodb://admin:secret@genome-db:27017';
// const client = new MongoClient(url);
// const dbName = 'genome-db';

// let seqPkg;
// const seqCollection = async () => {
//   if (!seqPkg) {
//     await client.connect();
//     const db = client.db(dbName);
//     seqPkg = db.collection('sequences');
//   }
//   return seqPkg;
// };

// // reads the first document in the collection (if storing as one, this is the only document)
// const read = async () => {
//   try {
//     const collection = await seqCollection();
//     const docs = await collection.find({}).toArray();
//     return docs[0] || {};
//   } catch (err) {
//     console.log(err);
//   }
// };

// // write
// const write = async (data) => {
//   try {
//     const collection = await seqCollection();
//     await collection.deleteMany({});
//     await collection.insertOne(data);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const drop = async () => {
//   try {
//     const collection = await seqCollection();
//     await collection.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// };

// export default { read, write, drop };

import fs from 'fs';

const read = () => {
  if (fs.existsSync('seqs.json')) {
    const posts = fs.readFileSync('seqs.json');
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (seqs) => {
  fs.writeFileSync('seqs.json', JSON.stringify(seqs));
};

const drop = () => {
  if (fs.existsSync('seqs.json')) {
    fs.writeFileSync('seqs.json', JSON.stringify({}));
  }
};

export default {
  read,
  write,
  drop,
};
