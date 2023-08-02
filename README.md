# MongoDB module
This module provides a MongoDB integration for connecting to a MongoDB server, performing database operations, and managing collections.

# .env configuration
config in microservice

# microsevice config example package.json
{
  "name": "[microservice name]",
  "version": "1.0.0",
  "description": "import the db module",
  "main": "[the server path]",
  "keywords": [],
  "author": "Shimi Yadan",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^17.0.21",
    "db": "git+https://github.com/ShimiYadan/db.git#1.0.1",
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "typescript": "file:typescript"
  }
}

# tsconfig.json
{
  "compilerOptions": {
    "types": ["node"],
    ... rest the configurations
  }
}

# MongoDB Module
This module provides a MongoDB integration for connecting to a MongoDB server, performing database operations, and managing collections.

# Installation
To use this module, you need to have MongoDB installed and running. You also need to install the required dependencies by running the following command:

# run the commands
install node -v 14+
npm install
npx run build

# DB
The DB class provides methods for connecting to MongoDB, accessing collections, and performing database operations.

# Error Handling
This module throws errors when there are issues with connecting to the MongoDB server or executing database operations. You should handle these errors appropriately in your application.

# Usage
```
import { DB } from 'db'

import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

const DB_NAME = process.env.DB_NAME || 'default'
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const TODOS_COLLECTION = process.env.TODOS_COLLECTION || 'default'
const USERS_COLLECTION = process.env.USERS_COLLECTION || 'default'

async function main() {
  try {
    await db.connectToMongoDB()

    const collection = db.getCollection('my-collection')

    const documents = await db.findDocuments(collection, { name: 'John' })
    console.log('Found documents:', documents)
    
    const insertedId = await db.insertDocument(collection, { name: 'Jane', age: 30 })
    console.log('Inserted document ID:', insertedId)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await db.close()
  }
}
main();
```
# License
This module is released under the MIT License.


