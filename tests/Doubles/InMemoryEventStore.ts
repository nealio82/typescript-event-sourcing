import EventStore from '../../src/EventHandling/EventStore'
import AggregateEvent from '../../src/Aggregate/AggregateEvent'
import AggregateId from '../../src/Aggregate/AggregateId'

export default class InMemoryEventStore implements EventStore {
    private storedEvents: Array<AggregateEvent> = []

    persist(events: Array<AggregateEvent>): void {
        this.storedEvents.push(...events)
    }

    events(aggregateId: AggregateId): Array<AggregateEvent> {
        return this.storedEvents
    }
}
