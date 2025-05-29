import { Kafka, KafkaConfig, Producer } from 'kafkajs'
import { MessageProducerBroker } from '../common/types/broker'
import { Config } from './index'
export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer

    constructor(clientId: string, brokers: string[]) {
        let kafkaConfig: KafkaConfig = {
            clientId,
            brokers,
        }

        if (Config.env.nodeEnv === 'production') {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true,
                connectionTimeout: 45000,
                sasl: (() => {
                    const username = Config.kafka.sasl.username
                    const password = Config.kafka.sasl.password
                    if (
                        typeof username !== 'string' ||
                        typeof password !== 'string'
                    ) {
                        throw new Error(
                            'Kafka SASL username and password must be defined as strings',
                        )
                    }
                    return {
                        mechanism: 'plain',
                        username,
                        password,
                    }
                })(),
            }
        }

        const kafka = new Kafka(kafkaConfig)
        this.producer = kafka.producer()
    }

    /**
     * Connect the producer
     */
    async connect() {
        await this.producer.connect()
    }

    /**
     * Disconnect the producer
     */
    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect()
        }
    }

    /**
     *
     * @param topic - the topic to send the message to
     * @param message - The message to send
     * @throws {Error} - When the producer is not connected
     */
    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        })
    }
}
