import EventStore from "../../src/EventStore";
import AggregateEvent from "../../src/AggregateEvent";
import AggregateId from "../../src/AggregateId";

export default class InMemoryEventStore implements EventStore {
    private storedEvents: Array<AggregateEvent> = [];

    persist(events: Array<AggregateEvent>): void {
        this.storedEvents.push(...events);
    }

    events(aggregateId: AggregateId): Array<AggregateEvent> {
        return this.storedEvents;
    }
}