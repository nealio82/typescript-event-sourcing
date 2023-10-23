import AggregateEvent from "./AggregateEvent";

export type StaticThis<T> = { new(): T };

abstract class Aggregate {
    private aggregateVersion: number = 0;

    private events: Array<AggregateEvent> = [];

    version(): number {
        return this.aggregateVersion;
    }

    raise(event: AggregateEvent): void {
        this.apply(event);
        this.events.push(event);
    }

    flush(): Array<AggregateEvent> {
        const events = this.events;
        this.events = [];
        return events;
    }

    static buildFromEvents<T extends Aggregate>(this: StaticThis<T>, events: Array<AggregateEvent>): T {
        let aggregate: T = new this();

        for (let i = 0; i < events.length; i++) {
            aggregate.apply(events[i]);
        }

        return <T>aggregate;
    }

    private apply(event: AggregateEvent): void {
        let eventClassName = Object.getPrototypeOf(event).constructor.name;

        let method: string = `apply${eventClassName}`;

        let aggregateName: string = Object.getPrototypeOf(this).constructor.name;

        if (typeof (this as any)[method] !== 'function') {
            throw new ReferenceError(`The "${aggregateName}" class does not yet have a function named "${method}" implemented`)
        }

        (this as any)[`apply${eventClassName}`]();

        this.aggregateVersion++;
    }
}

export default Aggregate;