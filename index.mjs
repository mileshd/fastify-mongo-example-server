// We can use ES Module syntax because the file extension is .mjs, instead of .js
import Fastify from 'fastify'
import MongoDBPlugin from '@fastify/mongodb'

// initilize fastify server instance
const fastify = Fastify({
  logger: true
})

fastify.register(MongoDBPlugin, {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  
  url: 'mongodb://127.0.0.1/mongo-test-db'
})

// Define a server rounte.
// A function to run when an HTTP request is made to the /test path
// on the server
fastify.get('/test', async (request, reply) => {
  // This was where it may have not worked before. The 'mongo' property
  // is added to the 'fastify' instance, not the 'this' object.
  //console.log(fastify.mongo)

  // Select a mongo db collection to interact with
  //const usersCollection = fastify.mongo.client.db(DATABASE_NAME).collection(COLLECTION_NAME)
  const usersCollection = fastify.mongo.client.db('mongo-test-db').collection('users')

  // Fetch all user documents in the users collection
  // The .find() method returns a cursor. A mongo db cursor is a JavaScript object (simlar to a promise)
  // where values are returned to you over time. The 'toArray' method collects all documents returned by
  // the cursor into a JavaScript Array
  let users
  try {
    users = await usersCollection.find({}).toArray()
    console.log(users)
  } catch (err) {
    console.log(err)
  }

  // Data to send to the client
  return {
    message: 'Test route successfully hit!',
    whatever: 'can go here',
    users
  }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 9444 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
