import AggregateId from "./AggregateId";
import EventStore from "./EventStore";
import Aggregate from "./Aggregate";

class EventStoreRepository {
    private eventStore: EventStore;

    constructor(eventStore: EventStore) {
        this.eventStore = eventStore;
    }

    public persist(aggregate: Aggregate): void {
        this.eventStore.persist(aggregate.flush())
    }

    public fetch<T extends Aggregate>(aggregateId: AggregateId, aggregate: T): T {
        // @todo: instantiate the aggregate here instead of in the client of this method call
        return <T>Aggregate.buildFromEvents(this.eventStore.events(aggregateId), aggregate);
    }
}

export default EventStoreRepository;