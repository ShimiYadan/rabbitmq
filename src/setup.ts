/*
    This module provides a rabbitMQ connection and simple functions such as produce and
    consume messages.
*/
import { connect, Channel, Connection, ConsumeMessage } from 'amqplib'

let RABBIT_MQ_URL: string

export class RabbitMQ {
    // Singleton instance of the rabbitMQ connection
    private channel: Channel | null = null
    private connection: Connection | null = null
    
    constructor(rabbitMqUrl: string) {
        RABBIT_MQ_URL = rabbitMqUrl
        this.setup()
    }
    
    async setup() {
        await this.connectToRabbitMQ()
        await this.createChannel()
    }

    // Connect to the rabbitMQ server and return the connection.
    async connectToRabbitMQ(): Promise<Connection> {
        if (!this.connection) {
            console.log('connecting to RabbitMQ...')
            this.connection = await connect(RABBIT_MQ_URL)
            console.log('RabbitMQ is connected')
        } 
        return this.connection
    }

    // Cteate Channel
    async createChannel(): Promise<Channel | null> {
        if (this.connection && !this.channel) {
            this.channel = await this.connection.createChannel()
        }
        return this.channel
    }
  
    public async setupConsumer(queueName: string): Promise<void> {
        await this.channel?.assertQueue(queueName)
        await this.channel?.consume(queueName, (msg: ConsumeMessage | null) => {
            if(msg !== null) {
                console.log('Received message:', msg.content.toString())
                this.channel?.ack(msg)
            }
        })
    }

    public async setupProducer(queueName: string, message: any): Promise<void> {
        let sMsg = JSON.stringify(message)
        await this.channel?.assertQueue(queueName)
        await this.channel?.sendToQueue(queueName, Buffer.from(sMsg))
        console.log(`The message ${sMsg} was sent to queue ${queueName}`)
    }

    public async close(): Promise<void> {
        await this.channel?.close()
        this.channel = null
        await this.connection?.close()
        this.connection = null
    }
}
