import AggregateEvent from "./AggregateEvent";

interface EventDispatcher {
    dispatch(events: Array<AggregateEvent>): void;
}

export default EventDispatcher;