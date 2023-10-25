import ESAggregate from "./Aggregate/Aggregate";
import ESAggregateEvent from "./Aggregate/AggregateEvent";
import ESAggregateId from "./Aggregate/AggregateId";
import ESEventDispatcher from "./EventHandling/EventDispatcher";
import ESEventStore from "./EventHandling/EventStore";
import ESEventStoreRepository from "./EventHandling/EventStoreRepository";

export namespace EventSourcing {

    export namespace Aggregate {
        export const Aggregate = ESAggregate;
        export type Aggregate = ESAggregate;

        export const AggregateId = ESAggregateId;
        export type AggregateId = ESAggregateId;

        export type AggregateEvent = ESAggregateEvent;
    }

    export namespace EventHandling {
        export type EventDispatcher = ESEventDispatcher;
        export type EventStore = ESEventStore;
        export const EventStoreRepository = ESEventStoreRepository;
        export type EventStoreRepository = ESEventStoreRepository;
    }
}