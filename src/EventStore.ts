import AggregateEvent from "./AggregateEvent";

interface EventStore {
    persist(events: Array<AggregateEvent>): void;

    events(aggregateId: AggregateId): Array<AggregateEvent>;
}

export default EventStore;