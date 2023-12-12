import { MongoClient } from "mongodb";

// TODO: replace url with real url
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "sequences";

let sequences;
const seqCollection = async () => {
  if (!sequences) {
    await client.connect();
    const db = client.db(dbName);
    sequences = db.collection("sequences");
  }
  return sequences;
};

const read = async () => {
  try {
    const collection = await seqCollection();
    const docs = await collection.find({}).toArray();
    return docs[0] || {};
  } catch (err) {
    console.log(err);
  }
};

const write = async (data) => {
  try {
    const collection = await seqCollection();
    await collection.deleteMany({});
    await collection.insertOne(data);
  } catch (err) {
    console.log(err);
  }
};

const drop = async () => {
  try {
    const collection = await seqCollection();
    await collection.deleteMany({});
  } catch (err) {
    console.log(err);
  }
};

export default { read, write, drop };
