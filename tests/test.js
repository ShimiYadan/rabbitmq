import { DB } from 'mongodb-module';

// Mock MongoDB server URL and database name
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'test-database';

describe('MongoDB Module', () => {
  let db;

  beforeAll(async () => {
    // Initialize the DB instance and connect to the MongoDB server
    db = new DB(mongoUrl, dbName);
    await db.connectToMongoDB();
  });

  afterAll(async () => {
    // Close the database connection
    await db.close();
  });

  describe('Database Operations', () => {
    let collection;

    beforeEach(() => {
      // Create a new collection before each test
      collection = db.getCollection('test-collection');
    });

    afterEach(async () => {
      // Drop the collection after each test
      await collection.drop();
    });

    test('Inserting and Finding Documents', async () => {
      // Insert a document into the collection
      const insertedId = await db.insertDocument(collection, { name: 'John' });

      // Find the inserted document
      const documents = await db.findDocuments(collection, { name: 'John' });

      expect(insertedId).toBeTruthy();
      expect(documents.length).toBe(1);
      expect(documents[0].name).toBe('John');
    });
  });
});
