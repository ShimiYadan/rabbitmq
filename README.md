# rabbitMQ module
This module provides a rabbitMQ connection and simple functions such as consume and produse messages.

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
    "rabbitmq": "git+https://github.com/ShimiYadan/rabbitmq.git#v1.0.0",
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

# Installation
To use this module, you need to have rabbitMQ installed and running. You also need to install the required dependencies by running the following command:

# run the commands
```
install node -v 14+
npm install
npx run build
```

# Error Handling
This module throws errors when there are issues with connecting to the rabbitMQ server or executing queue operations. You should handle these errors appropriately in your application.

# License
This module is released under the MIT License.


