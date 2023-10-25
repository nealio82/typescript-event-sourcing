import AggregateId from "../Aggregate/AggregateId";
import EventStore from "./EventStore";
import Aggregate from "../Aggregate/Aggregate";
import EventDispatcher from "./EventDispatcher";
import AggregateEvent from "../Aggregate/AggregateEvent";

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
        // might be better to dispatch the events on the bus only, and then subscribe to the events with the event
        // store persistence mechanism as an implementation of AggregateEventSubscriber
        this.eventStore.persist(events);
        this.eventDispatcher.dispatch(events);
    }

    public fetch<T extends Aggregate>(aggregateId: AggregateId, aggregate: T): T {
        // @todo: instantiate the aggregate here instead of in the client of this method call
        return <T>Aggregate.buildFromEvents(this.eventStore.events(aggregateId), aggregate);
    }
}

export default EventStoreRepository;