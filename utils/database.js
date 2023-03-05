const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1 
});

exports.connect = async () => {
  if (!client.connect()) await client.connect();
  const db = client.db("alpine");
  return { db, client };
}