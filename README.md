# Kafka Module
This module provides an Apache Kafka includes a connection and setup the producer and consumer.

# .env configuration
config in microservice

# client.properties configuration
config in main root dir

# microsevice config example package.json
{
  "name": "[microservice name]",
  "version": "1.0.0",
  "description": "import the kafka module",
  "main": "[the server path]",
  "keywords": [],
  "author": "Shimi Yadan",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^20.4.5",
    "typescript": "^5.1.6",
    "ts-node": "^10.9.1",
    "kafka": "git+https://github.com/ShimiYadan/kafka.git#1.0.0",
  }
}

# tsconfig.json
{
  "compilerOptions": {
    "types": ["node"],
    ... rest the configurations
  }
}

# Tests
npx jest

# Installation
To use this module, you need to have an Apache Kafka installed and running. You also need to install the required dependencies by running the following command:

Using Confluent Cloud for Apache Kafka
```https://confluent.cloud/```

install node -v 18+ (LTS July 2023)
you can download it from the official website here https://nodejs.org/en

# run the commands
npm install
npm run build

# Error Handling
This module throwes errors when there are issues with the connection or executing a producer or consumer  setups. You should handle these errors appropriately in your application.

# Usage
```
import { Kafka } from 'kafka'

import * as dotenv from 'dotenv'
dotenv.config({path: './.env'})

const GROUP_ID = process.env.GROUP_ID || 'default_groupId'
const TOPIC = process.env.TOPIC || 'default_topic'

async function main() {

  try {

    const msg1: object = {
        m: 1
    }
    const msg2: object = {
        m: 2
    }
   
    console.log(`groupId: ${GROUP_ID}`)
    const kafka = new Kafka(GROUP_ID)
    
    await kafka.produce(TOPIC, msg1, new Date())
    await kafka.produce(TOPIC, msg2, new Date())

    kafka.activateConsumer(TOPIC, (err: Error | null, msg: Message | null) => {
        if(err) console.error(`Error while activating consumer: ${err}`)
        console.log(`a message has received: ${msg?.value?.toString() ?? 'no message receivd'}`)
    }) 

  } catch (error) {
    console.error('Error:', error)
  }
}
main();
```

# License
This module is released under the MIT License.


