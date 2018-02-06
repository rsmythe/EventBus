namespace EventBusTS
{
    // EventSubscription
    // An object/method pair that takes in a specific event type
    //  Used to ensure the method is performed on the correct scope ('this')
    //
    // TTarget: The type of object that is listening
    // TEvent: The type of event to listen for
    //
    export class EventSubscription<TTarget, TEvent extends EventBase>
    {
        // target: An instantiated object that is handling this type of event
        // handler: The method that will handle the event
        //
        public constructor (public target: TTarget, public handler: (event: TEvent) => void)
        { }
    }

    export class EventBus
    {
        // eventRegistry
        //
        // eventRegistry: Contains a property for each event type that can be handled
        //  Each event type has a list of EventSubscriptions subscribed to it
        //
        private static eventRegistry: { [key: string]: EventSubscription<any, EventBase>[] } = {};

        // register
        //
        // Adds the event type to 'eventRegistry' if it doesn't already exist
        //  Registers target.handler() as a listener for eventType
        //
        // TEvent: The type of event to listen for
        // TTarget: The type of object that is listening
        //
        // eventType: The event type (constructor)
        // handler: The method that will handle the event
        // target: The object to apply the handler method against
        //
        public static register<TEvent extends EventBase, TTarget>(eventType: IEventConstructor, handler: (evt: TEvent) => void, target: TTarget): void
        {
            let eventTypeName: string = this.getEventName(eventType);
            let listener: EventSubscription<TTarget, TEvent> = new EventSubscription(target, handler);

            this.eventRegistry.hasOwnProperty(eventTypeName) ? this.eventRegistry[eventTypeName].push(listener) : this.eventRegistry[eventTypeName] = [listener];
        }

        // unregister
        //
        // Removes any EventSubscriptions for 'eventType' registered by 'target'
        //
        // eventType: Event type 
        // target: The object that is no longer handling this type of event
        //
        public static unregister<TTarget>(eventType: IEventConstructor, target: TTarget): void
        {
            let eventTypeName: string = this.getEventName(eventType);
            if(this.eventRegistry.hasOwnProperty(eventTypeName) )
            {
                let eventRegistration: EventSubscription<any, EventBase>[] = this.eventRegistry[eventTypeName];
                eventRegistration
                    .filter(l => l.target !== target)
                    .forEach((listener, idx) =>
                    {
                        eventRegistration.splice(eventRegistration.indexOf(listener), 1);
                    });
            }
        }

        // dispatch
        //
        // Finds the event type in the event registry and calls all listeners
        //  The event object is passed as the first parameter
        // 
        // TEvent: The type of event being raised
        //
        // event: The raised event
        //
        public static dispatch<TEvent extends EventBase>(event: TEvent): void
        {
            let eventConstructor: IEventConstructor = <any>event.constructor;
            let eventType: string = this.getEventName(eventConstructor);
            if(this.eventRegistry.hasOwnProperty(eventType) )
            {
                let listeners: EventSubscription<any, TEvent>[] = this.eventRegistry[eventType];
                listeners.forEach((listener) =>
                {
                    if(listener && listener.handler) 
                    {
                        listener.handler.apply(listener.target, [event]);
                    }
                });
            }
        }

        // getEventName
        //
        // Used to get the type of an  (there is no simple way to do this in ES5)
        //  In ES6 this can be replaced with 'eventType.name'
        //
        // https://stackoverflow.com/questions/2648293/how-to-get-the-function-name-from-within-that-function
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
        //
        private static getEventName(eventType: IEventConstructor): string
        {
            let result: RegExpExecArray = /^function\s+([\w\$]+)\s*\(/.exec( eventType.toString() );
            return result  ?  result[ 1 ]  :  '';
        }
    }

    // IEventConstructor
    //
    // Just shorthand for a constructor that returns any EventBase type
    //
    export interface IEventConstructor
    {
        new (...args: any[]): EventBase;
    }


    // EventBase
    //
    // Base class to denote an event type
    //  Technically we could allow any object to be dispatched as an event
    //
    export abstract class EventBase
    {
        // Might want to remove this. It feels weird telling an event to dispatch itself.
        public Dispatch(): void
        {
            EventBus.dispatch(this);
        }
    }
}