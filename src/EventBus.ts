namespace EventBusTS
{
    export class EventListener<TListener, TEvent extends EventBase>
    {
        public constructor (public scope: TListener, public callback: (event: TEvent) => void)
        {

        }
    }

    export class EventBus
    {
        public static listeners: { [key: string]: EventListener<any, EventBase>[] } = {};

        public static addEventListener<TDispatcher, TListenerScope, TEvent extends EventBase>(type: new () => TEvent, callback: (event: TEvent) => void, scope: TListenerScope): void
        {
            type.prototype.toString();
            let typeName: string = type.name;
            let listener: EventListener<TListenerScope, TEvent> = new EventListener(scope, callback);

            this.listeners.hasOwnProperty(typeName) ? this.listeners[typeName].push(listener) : this.listeners[typeName] = [listener];
        }

        public static dispatch<TEvent extends EventBase>(event: TEvent): void
        {
            let type: string = event.constructor.name;
            if(this.listeners.hasOwnProperty(type) )
            {
                let listeners: EventListener<any, TEvent>[] = this.listeners[type];
                listeners.forEach((listener) =>
                {
                    if(listener && listener.callback) 
                    {
                        listener.callback.apply(listener.scope, [event]);
                    }
                });
            }
        }
    }

    export abstract class EventBase
    {
        public Dispatch(): void
        {
            EventBus.dispatch(this);
        }
    }
}