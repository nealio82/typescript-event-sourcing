import AggregateId from './AggregateId'

interface AggregateEvent {
    aggregateId(): AggregateId
}

export default AggregateEvent
