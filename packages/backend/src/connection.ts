import { MongoClient } from 'mongodb';

const userName = process.env.MONGOUSER_WC;
const password = process.env.MONGOPASSWORD_WC;
const hostname = process.env.MONGOHOSTNAME_WC;

if (!userName || !password || !hostname) {
  throw Error('Database not configured. Set environment variables.');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);

export default client.db('WebSocketChat');
