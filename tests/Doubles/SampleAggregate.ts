import Aggregate from '../../src/Aggregate/Aggregate'
import AggregateId from '../../src/Aggregate/AggregateId'
import AggregateEvent from '../../src/Aggregate/AggregateEvent'

export default class SampleAggregate extends Aggregate {
    private appliedEvents: Array<string> = []

    id(): AggregateId {
        return new (class extends AggregateId {
            toString(): string {
                return '12345'
            }
        })()
    }

    applyFirstEvent(event: AggregateEvent): void {
        this.appliedEvents.push('FirstEvent')
    }

    applySecondEvent(event: AggregateEvent): void {
        this.appliedEvents.push('SecondEvent')
    }

    applyThirdEvent(event: AggregateEvent): void {
        this.appliedEvents.push('ThirdEvent')
    }

    wasApplied(event: AggregateEvent): boolean {
        let eventClassName = Object.getPrototypeOf(event).constructor.name

        return this.appliedEvents.includes(eventClassName)
    }
}
