import AggregateEvent from '../../src/Aggregate/AggregateEvent'
import AggregateId from '../../src/Aggregate/AggregateId'

export default class SecondEvent implements AggregateEvent {
    aggregateId(): AggregateId {
        return new (class extends AggregateId {
            toString(): string {
                return '12345'
            }
        })()
    }
}
