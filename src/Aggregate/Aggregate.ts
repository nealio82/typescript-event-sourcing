import AggregateEvent from "./AggregateEvent";
import AggregateId from "./AggregateId";

abstract class Aggregate {
    private aggregateVersion: number = 0;

    private events: Array<AggregateEvent> = [];

    public abstract id(): AggregateId;

    public version(): number {
        return this.aggregateVersion;
    }

    public raise(event: AggregateEvent): void {
        this.apply(event);
        this.events.push(event);
    }

    public flush(): Array<AggregateEvent> {
        const events = this.events;
        this.events = [];
        return events;
    }

    public static buildFromEvents<T extends Aggregate>(events: Array<AggregateEvent>, aggregate: T): T {
        if (aggregate.events.length > 0) {
            throw Error('Cannot rebuild aggregate from events if other events have already been applied')
        }

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