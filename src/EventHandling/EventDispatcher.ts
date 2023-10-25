import AggregateEvent from '../Aggregate/AggregateEvent'

interface EventDispatcher {
    dispatch(events: Array<AggregateEvent>): void
}

export default EventDispatcher
