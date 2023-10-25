import EventDispatcher from "../../src/EventDispatcher";
import AggregateEvent from "../../src/AggregateEvent";

export default class InMemoryEventDispatcher implements EventDispatcher {
    private dispatchedEvents: Array<string> = [];

    dispatch(events: Array<AggregateEvent>) {
        for (let i = 0; i < events.length; i++) {
            this.dispatchedEvents.push(Object.getPrototypeOf(events[i]).constructor.name);
        }
    }

    wasDispatched(event: AggregateEvent): boolean {
        let eventClassName = Object.getPrototypeOf(event).constructor.name;

        return this.dispatchedEvents.includes(eventClassName);
    }
}