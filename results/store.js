import fs from 'fs';

const read = () => {
  if (fs.existsSync('results.json')) {
    const posts = fs.readFileSync('results.json');
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (results) => {
  fs.writeFileSync('results.json', JSON.stringify(results));
};

const drop = () => {
  if (fs.existsSync('results.json')) {
    fs.writeFileSync('results.json', JSON.stringify({}));
  }
};

export default {
  read,
  write,
  drop,
};

// import { MongoClient } from 'mongodb';

// const url = 'mongodb://admin:secret@genome-db:27017';
// const client = new MongoClient(url);
// const dbName = 'genome-db';

// let results;
// const resCollection = async () => {
//   if (!results) {
//     await client.connect();
//     const db = client.db(dbName);
//     results = db.collection('results');
//   }
//   return results;
// };

// // reads the first document in the collection (if storing as one, this is the only document)
// const read = async () => {
//   try {
//     const collection = await resCollection();
//     const docs = await collection.find({}).toArray();
//     return docs[0] || {};
//   } catch (err) {
//     console.log(err);
//   }
// };

// // write
// const write = async (data) => {
//   try {
//     const collection = await resCollection();
//     await collection.deleteMany({});
//     await collection.insertOne(data);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const drop = async () => {
//   try {
//     const collection = await resCollection();
//     await collection.deleteMany({});
//   } catch (err) {
//     console.log(err);
//   }
// };

// export default { read, write, drop };
