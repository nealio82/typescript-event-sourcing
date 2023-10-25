import Aggregate from "../src/Aggregate/Aggregate";
import AggregateEvent from "../src/Aggregate/AggregateEvent";
import AggregateId from "../src/Aggregate/AggregateId";
import SampleAggregate from "./Doubles/SampleAggregate";
import FirstEvent from "./Doubles/FirstEvent";
import SecondEvent from "./Doubles/SecondEvent";
import ThirdEvent from "./Doubles/ThirdEvent";

describe("Aggregate", () => {
    test('aggregate version is zero when no events have occurred', () => {
        const aggregate = new SampleAggregate();

        expect(aggregate.version()).toBe(0)
    })

    test('aggregate version is incremented when new events are raised', () => {
        const aggregate = new SampleAggregate();

        aggregate.raise(new class FirstEvent implements AggregateEvent {
            aggregateId(): AggregateId {
                return new class extends AggregateId {
                    toString(): string {
                        return "12345";
                    }
                }
            }
        });
        expect(aggregate.version()).toBe(1)

        aggregate.raise(new class SecondEvent implements AggregateEvent {
            aggregateId(): AggregateId {
                return new class extends AggregateId {
                    toString(): string {
                        return "12345";
                    }
                }
            }
        });
        expect(aggregate.version()).toBe(2)
    })

    test('raised aggregate event is applied to the aggregate object', () => {
        const aggregate = new SampleAggregate();

        aggregate.raise(new FirstEvent());
        expect(aggregate.wasApplied(new FirstEvent())).toBe(true)
        expect(aggregate.wasApplied(new SecondEvent())).toBe(false)

        aggregate.raise(new SecondEvent());
        expect(aggregate.wasApplied(new SecondEvent())).toBe(true)
    })

    test('exception is thrown when no apply... method exists', () => {
        const aggregate = new SampleAggregate();

        const execution = () => {
            aggregate.raise(new class UnhandledEvent implements AggregateEvent {
                aggregateId(): AggregateId {
                    return new class extends AggregateId {
                        toString(): string {
                            return "12345";
                        }
                    }
                }
            });
        };

        expect(execution).toThrow(ReferenceError)
        expect(execution)
            .toThrow('The "SampleAggregate" class does not yet have a function named "applyUnhandledEvent" implemented');
    })

    test('aggregate is recreated from existing events', () => {

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();

        const aggregate = Aggregate.buildFromEvents([
            firstEvent,
            secondEvent
        ], new SampleAggregate());

        expect(aggregate.wasApplied(firstEvent)).toBe(true)
        expect(aggregate.wasApplied(secondEvent)).toBe(true)
        expect(aggregate.version()).toBe(2)
    })

    test('aggregate cannot be built from existing events if other events have already been applied', () => {

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();

        let aggregate = new SampleAggregate();

        aggregate.raise(new FirstEvent());

        const execution = () => {
            Aggregate.buildFromEvents([
                firstEvent,
                secondEvent
            ], aggregate);
        };

        expect(execution).toThrow(Error)
        expect(execution)
            .toThrow('Cannot rebuild aggregate from events if other events have already been applied');
    })

    test('events are flushed', () => {
        const aggregate = new SampleAggregate();

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();
        const thirdEvent = new ThirdEvent();

        aggregate.raise(firstEvent);
        aggregate.raise(secondEvent);
        aggregate.raise(thirdEvent);

        expect(aggregate.flush()).toEqual([
            firstEvent,
            secondEvent,
            thirdEvent
        ])
    })

    test('previously flushed events are not flushed again', () => {
        const aggregate = new SampleAggregate();

        const firstEvent = new FirstEvent();
        const secondEvent = new SecondEvent();
        const thirdEvent = new ThirdEvent();

        aggregate.raise(firstEvent);
        aggregate.raise(secondEvent);
        aggregate.raise(thirdEvent);

        aggregate.flush()

        expect(aggregate.flush()).toEqual([])
    })

    test('new events are added after aggregate has been rebuilt from previous', () => {

        const aggregate = Aggregate.buildFromEvents([
            new FirstEvent(),
            new SecondEvent(),
        ], new SampleAggregate());

        aggregate.raise(new ThirdEvent())

        expect(aggregate.flush()).toEqual([new ThirdEvent()])
        expect(aggregate.version()).toBe(3)
    })
});