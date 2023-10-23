import Aggregate from "../src/Aggregate";
import AggregateEvent from "../src/AggregateEvent";

describe("Aggregate", () => {
    test('aggregate version is zero when no events have occurred', () => {
        const aggregate = new class extends Aggregate {
        };

        expect(aggregate.version()).toBe(0)
    })

    test('aggregate version is incremented when new events are raised', () => {
        const aggregate = new class extends Aggregate {
            applyEmptyEvent(): void {

            }
        };

        aggregate.raise(new class EmptyEvent implements AggregateEvent {
        });
        expect(aggregate.version()).toBe(1)

        aggregate.raise(new class EmptyEvent implements AggregateEvent {
        });
        expect(aggregate.version()).toBe(2)
    })

    test('raised aggregate event is applied to the aggregate object', () => {
        const aggregate = new class extends Aggregate {

            private firstEventApplied: boolean = false;
            private secondEventApplied: boolean = false;

            wasFirstEventApplied(): boolean {
                return this.firstEventApplied;
            }

            wasSecondEventApplied(): boolean {
                return this.secondEventApplied;
            }

            applyFirstEvent(event: AggregateEvent): void {
                this.firstEventApplied = true;
            }

            applySecondEvent(event: AggregateEvent): void {
                this.secondEventApplied = true;
            }
        };

        aggregate.raise(new class FirstEvent implements AggregateEvent {
        });
        expect(aggregate.wasFirstEventApplied()).toBe(true)
        expect(aggregate.wasSecondEventApplied()).toBe(false)

        aggregate.raise(new class SecondEvent implements AggregateEvent {
        });
        expect(aggregate.wasSecondEventApplied()).toBe(true)
    })

    test('exception is thrown when no apply... method exists', () => {
        const aggregate = new class SampleAggregate extends Aggregate {

        };

        const execution = () => {
            aggregate.raise(new class UnhandledEvent implements AggregateEvent {
            });
        };

        expect(execution).toThrow(ReferenceError)
        expect(execution)
            .toThrow('The "SampleAggregate" class does not yet have a function named "applyUnhandledEvent" implemented');
    })

    test('aggregate is recreated from existing events', () => {
        class SampleAggregate extends Aggregate {
            private firstEventApplied: boolean = false;
            private secondEventApplied: boolean = false;

            wasFirstEventApplied(): boolean {
                return this.firstEventApplied;
            }

            wasSecondEventApplied(): boolean {
                return this.secondEventApplied;
            }

            applyFirstEvent(event: AggregateEvent): void {
                this.firstEventApplied = true;
            }

            applySecondEvent(event: AggregateEvent): void {
                this.secondEventApplied = true;
            }
        }

        const aggregate = SampleAggregate.buildFromEvents([
            new class FirstEvent implements AggregateEvent {
            },
            new class SecondEvent implements AggregateEvent {
            },
        ]);

        expect(aggregate.wasFirstEventApplied()).toBe(true)
        expect(aggregate.wasSecondEventApplied()).toBe(true)
        expect(aggregate.version()).toBe(2)
    })

    test('events are flushed', () => {
        const aggregate = new class SampleAggregate extends Aggregate {
            applyFirstEvent(event: AggregateEvent): void {
            }

            applySecondEvent(event: AggregateEvent): void {
            }

            applyThirdEvent(event: AggregateEvent): void {
            }
        }

        aggregate.raise(new class FirstEvent implements AggregateEvent {
        });
        aggregate.raise(new class SecondEvent implements AggregateEvent {
        });
        aggregate.raise(new class ThirdEvent implements AggregateEvent {
        });

        expect(aggregate.flush()).toEqual([
            new class FirstEvent implements AggregateEvent {
            },
            new class SecondEvent implements AggregateEvent {
            },
            new class ThirdEvent implements AggregateEvent {
            },
        ])
    })

    test('previously flushed events are not flushed again', () => {
        const aggregate = new class SampleAggregate extends Aggregate {
            applyFirstEvent(event: AggregateEvent): void {
            }

            applySecondEvent(event: AggregateEvent): void {
            }

            applyThirdEvent(event: AggregateEvent): void {
            }
        }

        aggregate.raise(new class FirstEvent implements AggregateEvent {
        });
        aggregate.raise(new class SecondEvent implements AggregateEvent {
        });
        aggregate.raise(new class ThirdEvent implements AggregateEvent {
        });

        aggregate.flush()

        expect(aggregate.flush()).toEqual([])
    })

    test('new events are added after aggregate has been rebuilt from previous', () => {
        class SampleAggregate extends Aggregate {
            applyFirstEvent(event: AggregateEvent): void {
            }

            applySecondEvent(event: AggregateEvent): void {
            }

            applyThirdEvent(event: AggregateEvent): void {
            }
        }

        const aggregate = SampleAggregate.buildFromEvents([
            new class FirstEvent implements AggregateEvent {
            },
            new class SecondEvent implements AggregateEvent {
            },
        ]);

        aggregate.raise(new class ThirdEvent implements AggregateEvent {
        })

        expect(aggregate.flush()).toEqual([new class ThirdEvent implements AggregateEvent {
        }])
        expect(aggregate.version()).toBe(3)
    })
});