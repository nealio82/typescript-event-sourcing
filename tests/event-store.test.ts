import SampleAggregate from "./Doubles/SampleAggregate";
import EventStore from "../src/EventStore";
import AggregateEvent from "../src/AggregateEvent";
import AggregateId from "../src/AggregateId";
import EventStoreRepository from "../src/EventStoreRepository";
import FirstEvent from "./Doubles/FirstEvent";
import SecondEvent from "./Doubles/SecondEvent";
import ThirdEvent from "./Doubles/ThirdEvent";
import EventDispatcher from "../src/EventDispatcher";
import InMemoryEventDispatcher from "./Doubles/InMemoryEventDispatcher";
import InMemoryEventStore from "./Doubles/InMemoryEventStore";

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

        const repository = new EventStoreRepository(eventStore, new InMemoryEventDispatcher());

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

        const eventStore = new InMemoryEventStore();

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();
        const thirdEvent = new ThirdEvent();

        const repository = new EventStoreRepository(eventStore, new InMemoryEventDispatcher());

        eventStore.persist([firstEvent, secondEvent, thirdEvent]);

        const storedAggregate: SampleAggregate = repository.fetch(aggregateId, new SampleAggregate);

        expect(storedAggregate.wasApplied(firstEvent)).toBe(true);
        expect(storedAggregate.wasApplied(secondEvent)).toBe(true);
        expect(storedAggregate.wasApplied(thirdEvent)).toBe(true);
    })

    test('aggregate events are dispatched over message bus when persisted', () => {

        const aggregateId = new class extends AggregateId {
            toString(): string {
                return "123";
            }
        }

        const eventStore = new InMemoryEventStore();

        const eventDispatcher = new InMemoryEventDispatcher();

        const aggregate = new SampleAggregate();

        const firstEvent = new FirstEvent;
        const secondEvent = new SecondEvent;
        const thirdEvent = new ThirdEvent;

        aggregate.raise(firstEvent);
        aggregate.raise(secondEvent);
        aggregate.raise(thirdEvent);

        const repository = new EventStoreRepository(eventStore, eventDispatcher);

        expect(eventDispatcher.wasDispatched(firstEvent)).toBe(false);
        expect(eventDispatcher.wasDispatched(secondEvent)).toBe(false);
        expect(eventDispatcher.wasDispatched(thirdEvent)).toBe(false);

        repository.persist(aggregate);

        expect(eventDispatcher.wasDispatched(firstEvent)).toBe(true);
        expect(eventDispatcher.wasDispatched(secondEvent)).toBe(true);
        expect(eventDispatcher.wasDispatched(thirdEvent)).toBe(true);
    })
});
