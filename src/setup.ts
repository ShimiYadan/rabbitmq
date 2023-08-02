/**
 * This module provides a Kafka integration connecting to a Kafka server.
 */
import { Producer, KafkaConsumer, Message } from 'node-rdkafka'
import { readFileSync } from 'fs'
import * as path from 'path'

/**
 * Callback function type for consuming messages from Kafka.
 */
interface ConsumerCallback {
    /**
     * Handles the result of the Kafka message consumption.
     * @param error - The error (if any) that occurred during message consumption.
     * @param result - The Kafka message that was consumed (if successful).
     */
    (error: Error | null, result: Message | null): void
}

export class Kafka {
    /**
     * Kafka producer instance.
     */
    private producer: Producer | null = null

    /**
     * The group ID for the Kafka consumer.
     */
    private groupId: string | null = null

    /**
     * Kafka consumer instance.
     */
    private consumer: KafkaConsumer | null = null

    /**
     * Configuration options for Kafka producer and consumer.
     */
    private config: { [key: string]: string | null } = {}

    /**
     * The file name of the Kafka client properties file.
     */
    private fileName: string = path.join(__dirname, '../client.properties')

    /**
     * Create a new Kafka instance with the given group ID.
     * @param groupId - The group ID for the Kafka consumer.
     */
    constructor(groupId: string) {
        this.groupId = groupId
        this.setup()
    }

    /**
     * Setup the Kafka producer and consumer by reading configuration and initializing connections.
     * @private
     */
    private async setup() {
        this.config = this.readConfigFile(this.fileName)
        this.config["group.id"] = this.groupId
        await this.setupProducer()
        this.setupConsumer()
    }

    /**
     * Read the Kafka client properties file and return the configuration options as an object.
     * @param fileName - The file name of the Kafka client properties file.
     * @returns The configuration options as an object.
     * @private
     */
    private readConfigFile(fileName: string): { [key: string]: string} {
        const data = readFileSync(fileName, 'utf8').toString().split('\n')
        return data.reduce<{ [key: string]: string }>((config, line) => {
            const [key, value] = line.split('=')
            if(key && value) {
                config[key.trim()] = value.trim()
            }
            return config
        }, {})
    }

    /**
     * Setup the Kafka producer and connect to the Kafka broker.
     * @private
     */
    private async setupProducer() {
        console.log('setup Kafka Producer...')
        this.producer = new Producer(this.config)
        
        this.handleErrors()
        await this.producer?.connect()
        console.log('Kafka Producer is ready')
    }
    
    /**
     * Setup the Kafka consumer and connect to the Kafka broker.
     * @private
     */
    private setupConsumer() {
        console.log('setup Kafka Consumer...')
        this.consumer = new KafkaConsumer(this.config,{ "auto.offset.reset": "earliest" })
        console.log('Kafka Consumer is ready')
    }

    /**
     * Produce a message to the specified Kafka topic with an optional scheduling time.
     * @param topic - The Kafka topic to produce the message to.
     * @param message - The message to be sent to Kafka.
     * @param date - Optional scheduling time for the message. If provided, the message will be scheduled for the given time.
     * @returns A Promise that resolves when the message is sent to Kafka.
     */
    async produce(topic: string, message: object, date: Date | null): Promise<void> {
        
        const msg: string = JSON.stringify(message)
        const scheduleMsg = date? new Date(date).getTime() - Date.now(): 0

        this.producer?.on('ready', () => {
            console.log(`Kafka Producer sending the message: ${message} to topic: ${topic} and schedule it to: ${date}`)
            this.producer?.produce(topic, null, Buffer.from(msg), null, scheduleMsg)
        })
    }

    /**
     * Activate the Kafka consumer for the specified topic and handle message consumption.
     * @param topic - The Kafka topic to consume messages from.
     * @param consumerCallback - The callback function to handle the consumed Kafka message.
     * @returns A Promise that resolves when the consumer is activated.
     */
    async activateConsumer(topic: string, consumerCallback: ConsumerCallback): Promise<void> {
        this.consumer?.connect()
        this.consumer?.on('ready', () => {
            this.consumer?.subscribe([topic])
            this.consumer?.consume()
        })
        .on("data", (message: Message) => {
            try {
                consumerCallback(null, message)
                this.consumer?.commitMessage(message)
                console.log(`a message is commited: ${message}`)
            } catch (err: any) {
                consumerCallback(err, null)
                console.error('Error sending notification: ', err)
            }
        })
    }

    /**
     * Close the Kafka producer and consumer connections.
     * @returns A Promise that resolves when the connections are closed.
     */
    async close(): Promise<void> {
        try {
            this.producer?.disconnect()
            this.consumer?.disconnect()
            console.log('Disconnected from Kafka. Esiting...')
        } catch (err) {
            console.error('Error closing connections: ', err)
        }
    }

    /**
     * Setup error handling for the Kafka producer and consumer.
     * @private
     */
    private handleErrors() {
        this.producer?.on('event.error', (err) => {
            console.error('Error from Kafka Producer: ', err)
        })

        this.consumer?.on('event.error', (err) => {
            console.error('Error from Kafka Consumer: ', err)
        })
    }
}

