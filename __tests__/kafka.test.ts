import { Kafka } from '../src/setup'

// Sample test for the Kafka module
describe('Kafka', () => {
    const topic = 'schedule-notifications'
    const groupId = 'schedule-notifications'

    // Test the setup method
    test('setup', async () => {
        const kafka = new Kafka(groupId)

        // a jest.fn() to create mock functions for callbacks
        const consumerCallback = jest.fn((error, result) => {
        // assertions for the callback logic go here 
        expect(error).toBe(null)
        expect(result).not.toBe(null)
    })

    kafka.activateConsumer(topic, consumerCallback)
    })
})
