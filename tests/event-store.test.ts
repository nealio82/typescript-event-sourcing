import SampleAggregate from "./Doubles/SampleAggregate";
import EventStore from "../src/EventStore";
import AggregateEvent from "../src/AggregateEvent";
import AggregateId from "../src/AggregateId";
import EventStoreRepository from "../src/EventStoreRepository";
import FirstEvent from "./Doubles/FirstEvent";
import SecondEvent from "./Doubles/SecondEvent";
import ThirdEvent from "./Doubles/ThirdEvent";

describe("Event Store", () => {

    test('aggregate events are persisted to storage', () => {

        const aggregateId = new class extends AggregateId {
            toString(): string {
                return "123";
            }
        }

        const eventStore = new class implements EventStore {
            private storedEvents: Array<AggregateEvent> = [];

            persist(events: Array<AggregateEvent>): void {
                this.storedEvents.push(...events);
            }

            events(aggregateId: AggregateId): Array<AggregateEvent> {
                return this.storedEvents;
            }
        }

        const aggregate = new SampleAggregate();

        const firstEvent = new FirstEvent;
        const secondEvent = new SecondEvent;
        const thirdEvent = new ThirdEvent;

        aggregate.raise(firstEvent);
        aggregate.raise(secondEvent);
        aggregate.raise(thirdEvent);

        const repository = new EventStoreRepository(eventStore);

        repository.persist(aggregate);

        expect(eventStore.events(aggregate.id())).toEqual(
            [firstEvent, secondEvent, thirdEvent]
        )
    })

    test('aggregate is recreated from storage', () => {
        const aggregateId = new class extends AggregateId {
            toString(): string {
                return "123";
            }
        }

        const eventStore = new class implements EventStore {
            private storedEvents: Array<AggregateEvent> = [];

            persist(events: Array<AggregateEvent>): void {
                this.storedEvents.push(...events);
            }

            events(aggregateId: AggregateId): Array<AggregateEvent> {
                return this.storedEvents;
            }
        }

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();
        const thirdEvent = new ThirdEvent();

        const repository = new EventStoreRepository(eventStore);

        eventStore.persist([firstEvent, secondEvent, thirdEvent]);

        const storedAggregate: SampleAggregate = repository.fetch(aggregateId, new SampleAggregate);

        expect(storedAggregate.wasApplied(firstEvent)).toBe(true);
        expect(storedAggregate.wasApplied(secondEvent)).toBe(true);
        expect(storedAggregate.wasApplied(thirdEvent)).toBe(true);
    })
});
