import AggregateEvent from "../../src/AggregateEvent";
import AggregateId from "../../src/AggregateId";

export default class SecondEvent implements AggregateEvent {
    aggregateId(): AggregateId {
        return new class extends AggregateId {
            toString(): string {
                return "12345";
            }
        }
    }
};