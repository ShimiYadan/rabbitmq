"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQ = void 0;
/*
    This module provides a MongoDB integration for connecting to a MongoDB server,
    performing database operations, and managing collections.
*/
const amqplib_1 = require("amqplib");
let RABBIT_MQ_URL;
class RabbitMQ {
    constructor(rabbitMqUrl) {
        // Singleton instance of the database client
        this.channel = null;
        this.connection = null;
        RABBIT_MQ_URL = rabbitMqUrl;
        this.setup();
    }
    async setup() {
        await this.connectToRabbitMQ();
        await this.createChannel();
    }
    // Connect to the MongoDB server and return the database client
    async connectToRabbitMQ() {
        if (!this.connection) {
            console.log('connecting to RabbitMQ...');
            this.connection = await (0, amqplib_1.connect)(RABBIT_MQ_URL);
            console.log('RabbitMQ is connected');
        }
        return this.connection;
    }
    // Get a reference to the collection
    async createChannel() {
        if (this.connection && !this.channel) {
            this.channel = await this.connection.createChannel();
        }
        return this.channel;
    }
    async setupConsumer(queueName) {
        var _a, _b;
        await ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertQueue(queueName));
        await ((_b = this.channel) === null || _b === void 0 ? void 0 : _b.consume(queueName, (msg) => {
            var _a;
            if (msg !== null) {
                console.log('Received message:', msg.content.toString());
                (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(msg);
            }
        }));
    }
    async setupProducer(queueName, message) {
        var _a, _b;
        let sMsg = JSON.stringify(message);
        await ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.assertQueue(queueName));
        await ((_b = this.channel) === null || _b === void 0 ? void 0 : _b.sendToQueue(queueName, Buffer.from(sMsg)));
        console.log(`The message ${sMsg} was sent to queue ${queueName}`);
    }
    async close() {
        var _a, _b;
        await ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
        this.channel = null;
        await ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
        this.connection = null;
    }
}
exports.RabbitMQ = RabbitMQ;
