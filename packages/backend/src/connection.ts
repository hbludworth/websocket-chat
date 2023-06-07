import { MongoClient } from 'mongodb';

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName || !password || !hostname) {
  throw Error('Database not configured. Set environment variables.');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);

export default client.db('FirebaseTemplate');