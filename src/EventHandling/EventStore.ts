import AggregateEvent from "../Aggregate/AggregateEvent";
import AggregateId from "../Aggregate/AggregateId";

interface EventStore {
    persist(events: Array<AggregateEvent>): void;

    events(aggregateId: AggregateId): Array<AggregateEvent>;
}

export default EventStore;