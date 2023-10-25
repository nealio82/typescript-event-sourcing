import AggregateId from "./AggregateId";
import EventStore from "./EventStore";
import Aggregate from "./Aggregate";
import EventDispatcher from "./EventDispatcher";
import AggregateEvent from "./AggregateEvent";

class EventStoreRepository {
    private eventStore: EventStore;
    private eventDispatcher: EventDispatcher;

    constructor(eventStore: EventStore, eventDispatcher: EventDispatcher) {
        this.eventStore = eventStore;
        this.eventDispatcher = eventDispatcher;
    }

    public persist(aggregate: Aggregate): void {
        let events: Array<AggregateEvent> = aggregate.flush();
        // @todo: make this safe in case of failure (eg if event store persistence succeeds but event dispatcher fails)
        this.eventStore.persist(events);
        this.eventDispatcher.dispatch(events);
    }

    public fetch<T extends Aggregate>(aggregateId: AggregateId, aggregate: T): T {
        // @todo: instantiate the aggregate here instead of in the client of this method call
        return <T>Aggregate.buildFromEvents(this.eventStore.events(aggregateId), aggregate);
    }
}

export default EventStoreRepository;